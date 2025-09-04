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
import MuiAccordionSummary, {AccordionSummaryProps, accordionSummaryClasses} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
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

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#849cd4ff', // ボタンの背景色
  color: '#000', // ボタンの文字色
  '&:hover': {
    backgroundColor: '#1565c0', // ホバー時の背景色
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface Props {
  sendJsonMessage: (data: any) => void;
  serverParams: any;
}

export default function Accordions_Multicopter({ sendJsonMessage, serverParams }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  // チェックボックス用ローカルstate
  const [localChecked, setLocalChecked] = React.useState<{[key: string]: boolean}>({});
  // カウンター用ローカルstate
  const [localCounters, setLocalCounters] = React.useState<{[key: string]: number}>({});
  // スコア用ローカルstate
  const [scoreValue, setScoreValue] = React.useState<number | ''>('');

  // 強制更新用のstate
  const [forceUpdate, setForceUpdate] = React.useState(0);

  // 一時的にローカル操作中のカウンターを記録
  const [pendingLocalUpdates, setPendingLocalUpdates] = React.useState<{[key: string]: number}>({});



  // サーバー値が来たらローカル値を上書き（サーバー優先）
  React.useEffect(() => {
    if (!serverParams) return;

    // 1秒後にpendingLocalUpdatesをクリア（サーバーからの応答があったとみなす）
    const timer = setTimeout(() => {
      setPendingLocalUpdates({});
    }, 1000);

 

    // チェックボックスの更新
    const newChecked: {[key: string]: boolean} = {};
    newChecked["mainmission_largeSupply_isCollect"] = serverParams.mainmission?.largeSupply?.isCollect ?? false;
    newChecked["mainmission_largeSupply_isDrropedToBox"] = serverParams.mainmission?.largeSupply?.isDrropedToBox ?? false;
    newChecked["zaqtransportation_isTransported"] = serverParams.zaqtransportation?.isTransported ?? false;
    newChecked["zaqtransportation_isLanded"] = serverParams.zaqtransportation?.isLanded ?? false;
    newChecked["eightTurn_isSuccess"] = serverParams.eightTurn?.isSuccess ?? false;
    newChecked["eightTurn_isHandsOff"] = serverParams.eightTurn?.isHandsOff ?? false;
    newChecked["failsafecontrol_failsafe_isHandsOff"] = serverParams.failsafecontrol?.isHandsOff ?? false;
    newChecked["uniqueMisson_unique_isSuccess"] = serverParams.uniqueMisson?.isSuccess ?? false;
    newChecked["hovering_isHandsOff"] = serverParams.hovering?.isHandsOff ?? false;
    newChecked["landing_isAreaTouchDown"] = serverParams.landing?.isAreaTouchDown ?? false;
    newChecked["landing_isInAreaStop"] = serverParams.landing?.isInAreaStop ?? false;
    
    setLocalChecked(newChecked);

    // カウンターの更新（pendingLocalUpdatesがない場合のみ）
    setLocalCounters(prev => {
      const newCounters: {[key: string]: number} = { ...prev };
      const dropareaValue = serverParams.mainmission?.droparea;
      const boxValue = serverParams.mainmission?.box;
      
   
      
      // ローカル更新中でない場合のみサーバー値で更新
      if (dropareaValue !== undefined && !pendingLocalUpdates["mainmission_droparea"]) {
        newCounters["mainmission_droparea"] = dropareaValue;
      }
      if (boxValue !== undefined && !pendingLocalUpdates["mainmission_box"]) {
        newCounters["mainmission_box"] = boxValue;
      }
      
   
      return newCounters;
    });

    setForceUpdate(prev => prev + 1);

    if (serverParams.uniqueMisson?.score !== undefined) {
      setScoreValue(serverParams.uniqueMisson.score);
    }

  

    return () => clearTimeout(timer);
  }, [serverParams, pendingLocalUpdates]);

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

  const handleButtonClick = (id: string, event?: any) => {
    let section = 'mainmission';
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
        failsafe_timer: 'failsafecontrol',
        mainmission_timer: 'mainmission'
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

  // スコア完了ボタン
  const handleScoreComplete = () => {
    sendData({ uniqueMisson: { score: Number(scoreValue) } });
  };

  // Counter（ローカル更新中はローカル値を優先）
  const createCounter = (id: string, label: string, section: string) => {
    const key = `${section}_${id}`;
    
    // ローカル更新中の値があるか確認
    const pendingValue = pendingLocalUpdates[key];
    const serverValue = serverParams?.[section]?.[id];
    const localValue = localCounters[key];
    
    // 優先順位：ローカル更新中 > サーバー値 > 既存ローカル値
    const value = pendingValue !== undefined ? pendingValue : 
                  serverValue !== undefined ? serverValue : 
                  localValue ?? 0;

 

    return (
      <>
        
        <Box sx={{ border: '1px solid #262e40', padding: 1, margin: 1 }}>
          <Typography>個数：{value}</Typography>
          <StyledButton onClick={() => {
            const newValue = value + 1;
           
            
            // ローカル更新をpendingに記録
            setPendingLocalUpdates(prev => ({
              ...prev,
              [key]: newValue,
            }));
            
            // 既存のローカルカウンターも更新
            setLocalCounters(prev => ({
              ...prev,
              [key]: newValue,
            }));
            
            handleButtonClick(`${id}_increment`);
          }}>+</StyledButton>
          <StyledButton onClick={() => {
            const newValue = Math.max(value - 1, 0);
            
            
            // ローカル更新をpendingに記録
            setPendingLocalUpdates(prev => ({
              ...prev,
              [key]: newValue,
            }));
            
            // 既存のローカルカウンターも更新
            setLocalCounters(prev => ({
              ...prev,
              [key]: newValue,
            }));
            
            handleButtonClick(`${id}_decrement`);
          }}>-</StyledButton>
        </Box>
      </>
    );
  };

  // チェックボックス（完全にサーバー値優先）
  const createCheckbox = (id: string, label: string, section: string, nestedKey?: string) => {
    const key = nestedKey ? `${section}_${nestedKey}_${id}` : `${section}_${id}`;
    // サーバー値を完全に優先
    const serverValue = nestedKey
      ? serverParams?.[section]?.[nestedKey]?.[id]
      : serverParams?.[section]?.[id];
    const checked = serverValue !== undefined ? serverValue : localChecked[key] ?? false;

   
      
    return (
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            sx={{ 
              color: '#fff',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
            checked={checked}
            onChange={(e) => {
              setLocalChecked(prev => ({ ...prev, [key]: e.target.checked }));
              const checkboxId = `${id}_${e.target.checked ? 'checked' : 'unchecked'}`;
              handleButtonClick(checkboxId, e);
            }}
          />
        }
        label={label}
      />
    );
  };

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

  React.useEffect(() => {
    console.log('Accordion-multicopter サーバー受信:', serverParams);
  }, [serverParams]);

  return (
    <div>
      

      {createAccordion("mainmission", "panel1", "メインミッション", (
        <>
          {createCounter("droparea", "投下エリア", "mainmission")}
          {createCounter("box", "高所運搬", "mainmission")}
          <FormGroup>
            {createCheckbox("isCollect", "救援物資（大）回収成功", "mainmission", "largeSupply")}
            {createCheckbox("isDrropedToBox", "救援物資（大）運搬成功", "mainmission", "largeSupply")}
          </FormGroup>
          <Stopwatch 
            id="mainmission_timer"
            start={serverParams?.mainmission?.epoch?.start}
            end={serverParams?.mainmission?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`mainmission_timer_${actionId}`, event)}
          />
        </>
      ))}

      {createAccordion("zaqtransportation", "panel2", "大型貨物運搬", (
        <FormGroup>
          {createCheckbox("isTransported", "運搬", "zaqtransportation")}
          {createCheckbox("isLanded", "着陸", "zaqtransportation")}
        </FormGroup>
      ))}

      {createAccordion("eightTurn", "panel3", "8の字飛行", (
        <FormGroup>
          {createCheckbox("isSuccess", "成功", "eightTurn")}
          {createCheckbox("isHandsOff", "ハンズオフ飛行", "eightTurn")}
        </FormGroup>
      ))}

      {createAccordion("failsafecontrol", "panel4", "耐故障制御", (
        <>
          <Stopwatch 
            id="failsafe_timer"
            start={serverParams?.failsafecontrol?.epoch?.start}
            end={serverParams?.failsafecontrol?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`failsafe_timer_${actionId}`, event)}
          />
          <FormGroup>
            {createCheckbox("failsafe_isHandsOff", "ハンズオフ飛行", "failsafecontrol")}
          </FormGroup>
        </>
      ))}

      {createAccordion("uniqueMisson", "panel5", "ユニークミッション", (
        <>
          <Stopwatch 
            id="unique_timer"
            start={serverParams?.uniqueMisson?.epoch?.start}
            end={serverParams?.uniqueMisson?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`unique_timer_${actionId}`, event)}
          />
          <FormGroup>
            {createCheckbox("unique_isSuccess", "成功", "uniqueMisson")}
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
              disabled={scoreValue === ''}
            >
              完了
            </Button>
          </Box>
        </>
      ))}

      {createAccordion("hovering", "panel6", "ホバリング", (
        <>
          <Stopwatch 
            id="hovering_timer"
            start={serverParams?.hovering?.epoch?.start}
            end={serverParams?.hovering?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`hovering_timer_${actionId}`, event)}
          />
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ飛行", "hovering")}
          </FormGroup>
        </>
      ))}

      {createAccordion("repair", "panel7", "修理", (
        <Stopwatch 
          id="repair_timer"
          start={serverParams?.repair?.epoch?.start}
          end={serverParams?.repair?.epoch?.end}
          onClick={(actionId, event) => handleButtonClick(`repair_timer_${actionId}`, event)}
        />
      ))}

      {createAccordion("landing", "panel8", "競技終了", (
        <FormGroup>
          {createCheckbox("isAreaTouchDown", "エリア内接地", "landing")}
          {createCheckbox("isInAreaStop", "エリア内停止", "landing")}
        </FormGroup>
      ))}
    </div>
  );
}

