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

  // 共通送信関数を追加
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

  return (
    <div>
      <Accordion id="mainmission" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="mainmission">
          <Typography component="span">メインミッション</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>投下エリア</Box>
          <Counter 
            id="droparea" 
            onClick={(actionId, event) => handleButtonClick(`droparea_${actionId}`, event)}
          />
          <Box>高所運搬</Box>
          <Counter 
            id="box"
            onClick={(actionId, event) => handleButtonClick(`box_${actionId}`, event)}
          />
          
          <FormGroup>
          <FormControlLabel
  control={
    <Checkbox
      id="isCollect"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isCollect_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="救援物資（大）回収成功"
/>
        </FormGroup>
        <FormGroup>
          <FormControlLabel
  control={
    <Checkbox
      id="isDrropedToBox"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isDrropedToBox_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="救援物資（大）運搬成功" />
        </FormGroup>
        
          <Stopwatch 
            id="mainmission_timer"
            onClick={(actionId, event) => handleButtonClick(`mainmission_timer_${actionId}`, event)}
          />

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography component="span">大型貨物運搬</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
        <FormControlLabel
  control={
    <Checkbox
      id="isTransported"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isTransported_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="運搬"
/>
         </FormGroup>

         <FormGroup>
         <FormControlLabel  control={<Checkbox id= "isLanded" sx={{ color: '#fff' }} onChange={(e) => {
    const checkboxId = `isLanded_${e.target.checked ? 'checked' : 'unchecked'}`;
    handleButtonClick(checkboxId, e);
  }} />}
          label="着陸" />
          </FormGroup>

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography component="span">8の字飛行</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
        <FormControlLabel
  control={
    <Checkbox
      id="isHandsOff"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isHandsOff_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="ハンズオフ飛行"
/>
         </FormGroup>

         <FormGroup>
         <FormControlLabel
  control={
    <Checkbox
      id="isSuccess"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isSuccess_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="成功" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion id="failsafecontrol" expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="failsafecontrol">
          <Typography component="span">耐故障制御</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch 
          id="failsafe_timer"
          onClick={(actionId, event) => handleButtonClick(`failsafe_timer_${actionId}`, event)}
        />
        <FormGroup>
         <FormControlLabel  control={<Checkbox 
         id= "failsafe_isHandsOff"
          sx={{ color: '#fff',  }}
          onChange={(e) => {
        const checkboxId = `failsafe_isHandsOff_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }} />}
       label="ハンズオフ飛行" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography component="span">ユニークミッション</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stopwatch 
            id="unique_timer"
            onClick={(actionId, event) => handleButtonClick(`unique_timer_${actionId}`, event)}
          />
          <FormGroup>
            <FormControlLabel  control={<Checkbox
              id="unique_isSuccess"
              sx={{ color: '#fff' }}
              onChange={(e) => {
                const checkboxId = `unique_isSuccess_${e.target.checked ? 'checked' : 'unchecked'}`;
                handleButtonClick(checkboxId, e);
              }}
            />} 
            label="成功" />
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
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="hovering">
          <Typography component="span">ホバリング</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch 
          id="hovering_timer"
          onClick={(actionId, event) => handleButtonClick(`hovering_timer_${actionId}`, event)}
        />
        <FormGroup>
         <FormControlLabel
  control={
    <Checkbox
      id="isHandsOff"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isHandsOff_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="ハンズオフ飛行"
/>
          </FormGroup>
         
         </AccordionDetails>
        
      </Accordion>
      
     
      <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
        <AccordionSummary aria-controls="panel9d-content" id="panel9d-header">
          <Typography component="span">修理</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch 
          id="repair_timer"
          onClick={(actionId, event) => handleButtonClick(`repair_timer_${actionId}`, event)}
        />
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel10'} onChange={handleChange('panel10')}>
        <AccordionSummary aria-controls="panel10d-content" id="panel10d-header">
          <Typography component="span">競技終了</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel
  control={
    <Checkbox
      id="isAreaTouchDown"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isAreaTouchDown_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="エリア内接地"
 />
         <FormControlLabel
  control={
    <Checkbox
      id="isInAreaStop"
      sx={{ color: '#fff' }}
      onChange={(e) => {
        const checkboxId = `isInAreaStop_${e.target.checked ? 'checked' : 'unchecked'}`;
        handleButtonClick(checkboxId, e);
      }}
    />
  }
  label="エリア内停止"
 />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>

    </div>
  );
}