import '../App.css';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {AccordionSummaryProps,accordionSummaryClasses,} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Counter from '../Components/Counter.tsx'
import Stopwatch from '../Components/Timer.tsx'
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
  width: '500px', 
  margin: '0 auto',
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
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
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#849cd4ff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

interface Props {
  sendJsonMessage: (data: any) => void;
  serverParams: any;
}

export default function Accordions_Plane({ sendJsonMessage, serverParams }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  // チェックボックス用ローカルstate
  const [localChecked, setLocalChecked] = React.useState<{[key: string]: boolean}>({});
  // カウンター用ローカルstate
  const [localCounters, setLocalCounters] = React.useState<{[key: string]: number}>({});
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
    // メインミッション
    newChecked["mainmission_success"] = serverParams?.mainmission?.success ?? false;
    // 救援物資回収
    newChecked["collection_isCollected"] = serverParams?.collection?.isCollected ?? false;
    newChecked["collection_isLanded"] = serverParams?.collection?.isLanded ?? false;
    // 水平旋回
    newChecked["holizontalLoop_isContinous"] = serverParams?.holizontalLoop?.isContinous ?? false;
    // 八の字飛行
    newChecked["eightTurn_isHandsOff"] = serverParams?.eightTurn?.isHandsOff ?? false;
    newChecked["eightTurn_isSuccess"] = serverParams?.eightTurn?.isSuccess ?? false;
    // 宙返り
    newChecked["loop_isHandsOff"] = serverParams?.loop?.isHandsOff ?? false;
    // 高所物資回収
    newChecked["highCollection_isCollected"] = serverParams?.highCollection?.isCollected ?? false;
    newChecked["highCollection_isLanded"] = serverParams?.highCollection?.isLanded ?? false;
    // 無動力滑空
    newChecked["gliding_isHandsOff"] = serverParams?.gliding?.isHandsOff ?? false;
    // 上昇旋回
    newChecked["risingLoop_isSuccess"] = serverParams?.risingLoop?.isSuccess ?? false;
    // 自動物資投下
    newChecked["automaticDrop_isTakeoffSuccess"] = serverParams?.automaticDrop?.isTakeoffSuccess ?? false;
    newChecked["automaticDrop_isDroppingSuccess"] = serverParams?.automaticDrop?.isDroppingSuccess ?? false;
    newChecked["automaticDrop_isLandingSuccess"] = serverParams?.automaticDrop?.isLandingSuccess ?? false;
    // 競技終了
    newChecked["landing_isAreaTouchDown"] = serverParams?.landing?.isAreaTouchDown ?? false;
    newChecked["landing_isInAreaStop"] = serverParams?.landing?.isInAreaStop ?? false;
    newChecked["landing_isRunwayLanding"] = serverParams?.landing?.isRunwayLanding ?? false;
    
    setLocalChecked(newChecked);

    // カウンターの更新（サーバーのキー名に合わせる）
    const newCounters: {[key: string]: number} = {};
    
    // メインミッション
    if (serverParams.mainmission?.area1 !== undefined) {
      newCounters["mainmission_area1"] = serverParams.mainmission.area1;
    }
    if (serverParams.mainmission?.area2 !== undefined) {
      newCounters["mainmission_area2"] = serverParams.mainmission.area2;
    }
    if (serverParams.mainmission?.area3 !== undefined) {
      newCounters["mainmission_area3"] = serverParams.mainmission.area3;
    }
    
    // ポール旋回（サーバーのキー名に合わせる）
    if (serverParams.poleLoop?.count !== undefined) {
      newCounters["poleLoop_count"] = serverParams.poleLoop.count;
    }
    if (serverParams.poleLoop?.continousCount !== undefined) {
      newCounters["poleLoop_continuousCount"] = serverParams.poleLoop.continousCount;
    }
    
    // 水平旋回（サーバーのキー名に合わせる）
    if (serverParams.holizontalLoop?.count !== undefined) {
      newCounters["holizontalLoop_count"] = serverParams.holizontalLoop.count;
    }
    
    // 宙返り
    if (serverParams.loop?.count !== undefined) {
      newCounters["loop_count"] = serverParams.loop.count;
    }
    
    
    setLocalCounters(newCounters);

    // pendingLocalUpdatesをクリア（サーバー値で上書きしたため）
    setPendingLocalUpdates({});

    setForceUpdate(prev => prev + 1);

  }, [serverParams]);

  const handleButtonClick = (id: string, event?: any) => {
    let section = 'mainmission';

    // Section取得
    if (event?.target) {
      const accordion = event.target.closest('.MuiAccordion-root');
      if (accordion?.id) section = accordion.id;
    }

    const [counterId, action] = id.split('_');
    const currentNum2 = getCurrentNum2();

    // Timer処理
    if (counterId.toLowerCase().includes('timer') && (action === 'start' || action === 'stop')) {
      const timeKey = action === 'start' ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      
      const timerSections = {
        mainMissionTimer: 'mainmission',
        glidingTimer: 'gliding',
        repairTimer: 'repair'
      };
      
      const targetSection = timerSections[counterId] || section;
      return sendData({ [targetSection]: { epoch: { [timeKey]: adjustedTimestamp } } });
    }

    // 通常処理
    let value;
    if (action === 'increment') value = 1;
    else if (action === 'decrement') value = -1;
    else if (action === 'checked') value = true;
    else if (action === 'unchecked') value = false;
    else value = 1;

    sendData({ [section]: { [counterId]: value } });
  };

  // 共通送信関数
  const sendData = (params: any) => {
    const category = 'plane';
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

  // Checkbox（サーバー値優先、ローカル値も管理）
  const createCheckbox = (id: string, label: string, section: string, nestedKey?: string) => {
    const key = nestedKey ? `${section}_${nestedKey}_${id}` : `${section}_${id}`;
    // サーバー値を最優先、なければローカル値
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
              color: '#000',
              '&.Mui-checked': {
                color: '#2074acff',
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

  // Counter（デバッグ情報付き）
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
        
        <Box sx={{ border: '1px solid #fff', padding: 1, margin: 1 }}>
          <Typography>数：{value}</Typography>
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
          <FormGroup>
            {createCheckbox("success", "メインミッション成功", "mainmission")}
          </FormGroup>
          {createCounter("area1", "エリア１", "mainmission")}
          {createCounter("area2", "エリア２", "mainmission")}
          {createCounter("area3", "エリア３", "mainmission")}
          <Stopwatch
            id="mainmission_timer"
            start={serverParams?.mainmission?.epoch?.start}
            end={serverParams?.mainmission?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`mainmission_timer_${actionId}`, event)}
          />
        </>
      ))}

      {createAccordion("poleLoop", "panel4", "ポール旋回（手動操縦専用）", (
        <>
          {createCounter("count", "回数", "poleLoop")}
          {createCounter("continuousCount", "連続旋回", "poleLoop")}
        </>
      ))}

      {createAccordion("holizontalLoop", "panel5", "水平旋回（自動操縦専用）", (
        <>
          {createCounter("count", "回数", "holizontalLoop")}
          <FormGroup>
            {createCheckbox("isContinous", "連続水平旋回", "holizontalLoop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("risingLoop", "panel6", "上昇旋回（自動操縦専用）", (
        <>
          <FormGroup>
            {createCheckbox("isSuccess", "上昇旋回成功", "risingLoop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("loop", "panel8", "宙返り", (
        <>
          {createCounter("count", "回数", "loop")}
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ成功", "loop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("eightTurn", "panel7", "八の字飛行", (
        <>
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ飛行", "eightTurn")}
            {createCheckbox("isSuccess", "成功", "eightTurn")}
          </FormGroup>
        </>
      ))}

      {createAccordion("highCollection", "panel9", "高所物資回収", (
        <>
          <FormGroup>
            {createCheckbox("isCollected", "回収成功", "highCollection")}
            {createCheckbox("isLanded", "着陸成功", "highCollection")}
          </FormGroup>
        </>
      ))}

      {createAccordion("repair", "panel10", "修理", (
        <>
          <Stopwatch 
            id="repairTimer"
            start={serverParams?.repair?.epoch?.start}
            end={serverParams?.repair?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`repairTimer_${actionId}`, event)}
          />
        </>
      ))}

      {createAccordion("automaticDrop", "panel11", "自動物資投下（自動操縦専用）", (
        <>
          <FormGroup>
            {createCheckbox("isTakeoffSuccess", "自動離陸成功", "automaticDrop")}
            {createCheckbox("isDroppingSuccess", "自動投下成功", "automaticDrop")}
            {createCheckbox("isLandingSuccess", "自動着陸成功", "automaticDrop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("collection", "panel12", "救援物資回収", (
        <>
          <FormGroup>
            {createCheckbox("isCollected", "回収成功", "collection")}
            {createCheckbox("isLanded", "着陸成功", "collection")}
          </FormGroup>
        </>
      ))}

      {createAccordion("gliding", "panel14", "無動力滑空", (
        <>
          <Stopwatch 
            id="glidingTimer"
            start={serverParams?.gliding?.epoch?.start}
            end={serverParams?.gliding?.epoch?.end}
            onClick={(actionId, event) => handleButtonClick(`glidingTimer_${actionId}`, event)}
          />
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ成功", "gliding")}
          </FormGroup>
        </>
      ))}

      {createAccordion("landing", "panel13", "競技終了", (
        <>
          <FormGroup>
            {createCheckbox("isAreaTouchDown", "エリア内接地", "landing")}
            {createCheckbox("isInAreaStop", "エリア内静止", "landing")}
            {createCheckbox("isRunwayLanding", "滑走路内着陸", "landing")}
          </FormGroup>
        </>
      ))}
    </div>
  );
}