import '../App.css';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Counter from '../Components/Counter';
import Stopwatch from '../Components/Timer'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; // 追加
import { createButtonClickData, saveJsonToFile,sendJsonToServer } from '../Data/handleButtonClick.tsx';
import { getCurrentNum2, getUnixTimestamp } from '../Data/time';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  backgroundColor: '#262e40', // 背景を黒に設定
  color: '#fff', 

  width: '500px', 
  margin: '0 auto', // 中央揃え
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#fff'  }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, 0.63)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface Props {
  sendJsonMessage: (data: any) => void;
}

export default function Accordions_Multicopter({ sendJsonMessage }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleButtonClick = (id: string, event?: any) => {
    let section = 'mainmission';
    
    // Section取得
    if (event?.target) {
      const accordion = event.target.closest('.MuiAccordion-root');
      if (accordion?.id) section = accordion.id;
    }

    const currentNum2 = getCurrentNum2();
    const value = id.includes('checked');

    // 特殊ケースのマッピング
    const specialCases = {
      'isAreaTouchDown': () => sendData({ landing: { isAreaTouchDown: value } }),
      'isInAreaStop': () => sendData({ landing: { isInAreaStop: value } }),
      'unique_isSuccess': () => sendData({ uniqueMisson: { isSuccess: value } }),
      'isCollect': () => sendData({ mainmission: { largeSupply: { isCollect: value } } }),
      'isDrropedToBox': () => sendData({ mainmission: { largeSupply: { isDrropedToBox: value } } }),
      'isTransported': () => sendData({ zaqtransportation: { isTransported: value } }),
      'isLanded': () => sendData({ zaqtransportation: { isLanded: value } }),
      'failsafe_isHandsOff': () => sendData({ failsafecontrol: { isHandsOff: value } }),
    };

    // 特殊ケース処理
    for (const [key, handler] of Object.entries(specialCases)) {
      if (id.includes(key)) return handler();
    }

    // Timer処理
    if (id.includes('timer') && (id.includes('start') || id.includes('stop'))) {
      const timeKey = id.includes('start') ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      
      const timerSections = {
        repair_timer: 'repair',
        hovering_timer: 'hovering',
        unique_timer: 'uniqueMisson',
        failsafe_timer: 'failsafecontrol'
      };
      
      const timerSection = Object.keys(timerSections).find(key => id.includes(key));
      const targetSection = timerSection ? timerSections[timerSection] : section;
      
      return sendData({ [targetSection]: { epoch: { [timeKey]: adjustedTimestamp } } });
    }

    // isHandsOff/isSuccess処理（section依存）
    if (id.includes('isHandsOff')) {
      const targetSection = section === 'hovering' ? 'hovering' : 'eightTurn';
      return sendData({ [targetSection]: { isHandsOff: value } });
    }
    
    if (id.includes('isSuccess')) {
      return sendData({ eightTurn: { isSuccess: value } });
    }

    // 通常処理
    const [counterId, action] = id.split('_');
    let actionValue;
    if (action === 'increment') actionValue = 1;
    else if (action === 'decrement') actionValue = -1;
    else if (action === 'checked') actionValue = true;
    else if (action === 'unchecked') actionValue = false;
    else actionValue = 1;

    sendData({ [section]: { [counterId]: actionValue } });
  };

  // スコア入力値を保持するstateを追加
  const [scoreValue, setScoreValue] = React.useState<number | ''>('');

  // 完了ボタンのクリック処理
  const handleScoreComplete = () => {
    const category = 'multicopter';
    const currentNum2 = getCurrentNum2();
    const adjustedEpoch = getUnixTimestamp() + currentNum2;
    const value = Number(scoreValue);

    const jsonData = {
      action: "update",
      category: category,
      epoch: adjustedEpoch,
      params: {
        uniqueMisson: {
          score: value
        }
      }
    };
    saveJsonToFile(jsonData);
    sendJsonMessage(jsonData);
  };

  // 共通送信関数
const sendData = (params: any) => {
  const category = 'multicopter';
  const currentNum2 = getCurrentNum2();
  const adjustedEpoch = getUnixTimestamp() + currentNum2;
  
  const jsonData = {
    action: "update",
    category,
    epoch: adjustedEpoch,
    params
  };
  
  saveJsonToFile(jsonData);
  sendJsonMessage(jsonData);
};

// Checkbox
const createCheckbox = (id: string, label: string) => (
  <FormControlLabel
    control={
      <Checkbox
        id={id}
        sx={{ color: '#fff' }}
        onChange={(e) => {
          const checkboxId = `${id}_${e.target.checked ? 'checked' : 'unchecked'}`;
          handleButtonClick(checkboxId, e);
        }}
      />
    }
    label={label}
  />
);

// Counter
const createCounter = (id: string, label: string) => (
  <>
    <Box>{label}</Box>
    <Counter 
      id={id} 
      onClick={(actionId, event) => handleButtonClick(`${id}_${actionId}`, event)}
    />
  </>
);

// Accordion
const createAccordion = (id: string, panel: string, title: string, children: React.ReactNode) => (
  <Accordion id={id} expanded={expanded === panel} onChange={handleChange(panel)}>
    <AccordionSummary aria-controls={`${panel}d-content`} id={id}>
      <Typography component="span">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

  return (
    <div>
      {createAccordion("mainmission", "panel1", "メインミッション", (
        <>
          {createCounter("droparea", "投下エリア")}
          {createCounter("box", "高所運搬")}
        <FormGroup>
          {createCheckbox("isCollect", "救援物資（大）回収成功")}
          {createCheckbox("isDrropedToBox", "救援物資（大）運搬成功")}
        </FormGroup>
          <Stopwatch 
            id="mainmission_timer"
            onClick={(actionId, event) => handleButtonClick(`mainmission_timer_${actionId}`, event)}
          />
        </>
      ))}
      {createAccordion("panel2", "panel2", "大型貨物運搬", (
        <FormGroup>
        {createCheckbox("isTransported", "運搬")}
          {createCheckbox("isLanded", "着陸")}
         </FormGroup>
      ))}
      {createAccordion("panel3", "panel3", "8の字飛行", (
        <FormGroup>
          {createCheckbox("isSuccess", "成功")}
          {createCheckbox("isHandsOff", "ハンズオフ飛行")}
        </FormGroup>
      ))}
      {createAccordion("failsafecontrol", "panel4", "耐故障制御", (
        <>
        <Stopwatch 
          id="failsafe_timer"
          onClick={(actionId, event) => handleButtonClick(`failsafe_timer_${actionId}`, event)}
        />
        <FormGroup>
         {createCheckbox("failsafe_isHandsOff", "ハンズオフ飛行")}
        </FormGroup>
        </>
      ))}
      {createAccordion("panel5", "panel5", "ユニークミッション", (
        <>
          <Stopwatch 
            id="unique_timer"
            onClick={(actionId, event) => handleButtonClick(`unique_timer_${actionId}`, event)}
          />
          <FormGroup>
            {createCheckbox("unique_isSuccess", "成功")}
          </FormGroup>
          <Box id="score" sx={{ mt: 2 }}>
            <Typography component="span" sx={{ mr: 1 }}>
              数値を入力してください:
            </Typography>
            <TextField 
              id="score"
              type="number"
              variant="outlined"
              size="small"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value === '' ? '' : Number(e.target.value))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#1976d2' },
                  '&:hover fieldset': { borderColor: '#1565c0' },
                  '&.Mui-focused fieldset': { borderColor: '#004ba0' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: '#fff' },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleScoreComplete}
              disabled={scoreValue === ''} // 空欄の時は押せない
            >
              完了
            </Button>
          </Box>
        </>
      ))}
      {createAccordion("panel6", "panel6", "ホバリング", (
        <>
        <Stopwatch 
          id="hovering_timer"
          onClick={(actionId, event) => handleButtonClick(`hovering_timer_${actionId}`, event)}
        />
        <FormGroup>
         {createCheckbox("isHandsOff", "ハンズオフ飛行")}
          </FormGroup>
         
        </>
      ))}
      {createAccordion("panel7", "panel7", "修理", (
        <Stopwatch 
          id="repair_timer"
          onClick={(actionId, event) => handleButtonClick(`repair_timer_${actionId}`, event)}
        />
      ))}
      {createAccordion("panel8", "panel8", "競技終了", (
        <FormGroup>
         {createCheckbox("isAreaTouchDown", "エリア内接地")}
         {createCheckbox("isInAreaStop", "エリア内停止")}
        </FormGroup>
      ))}
    </div>
  );
}