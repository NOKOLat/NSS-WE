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

interface Props {
  sendJsonMessage: (data: any) => void;
  serverParams: any;
}

export default function Accordions_Multicopter({ sendJsonMessage, serverParams }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
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
    sendJsonToServer(jsonData, sendJsonMessage);
  };

  // Checkbox
  const createCheckbox = (id: string, label: string, section: string, nestedKey?: string) => {
    // 通常は serverParams[section][id]
    // nestedKeyがあれば serverParams[section][nestedKey][id]
    let checked = false;
    if (nestedKey) {
      checked = serverParams?.[section]?.[nestedKey]?.[id] ?? false;
    } else {
      checked = serverParams?.[section]?.[id] ?? false;
    }

    return (
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            sx={{ color: '#000' }}
            checked={checked}
            onChange={(e) => {
              const checkboxId = `${id}_${e.target.checked ? 'checked' : 'unchecked'}`;
              handleButtonClick(checkboxId, e);
            }}
          />
        }
        label={label}
      />
    );
  };

  // Counter
  const createCounter = (id: string, label: string, section: string) => (
    <>
      <Box>{label}</Box>
      <Counter 
        id={id} 
        value={serverParams?.[section]?.[id] ?? 0}
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

      {createAccordion("collection", "panel2", "救援物資回収", (
        <>
          <FormGroup>
            {createCheckbox("isCollected", "回収成功", "collection")}
          </FormGroup>
          <FormGroup>
            {createCheckbox("isLanded", "着陸成功", "collection")}
          </FormGroup>
        </>
      ))}

      {createAccordion("gliding", "panel3", "無動力滑空", (
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

      {createAccordion("poleLoop", "panel4", "ポール旋回（手動操縦専用）", (
        <>
          {createCounter("count", "回数", "poleLoop")}
          {createCounter("continuousCount", "連続旋回", "poleLoop")}
        </>
      ))}

      {createAccordion("horizontalLoop", "panel5", "水平旋回（自動操縦専用）", (
        <>
          <FormGroup>
            {createCounter("count", "回数", "horizontalLoop")}
            {createCheckbox("isContinuous", "連続水平旋回", "horizontalLoop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("risingLoop", "panel6", "上昇旋回（自動操縦専用）", (
        <>
          <FormGroup>
            {createCounter("count", "回数", "risingLoop")}
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

      {createAccordion("loop", "panel8", "宙返り", (
        <>
          {createCounter("count", "回数", "loop")}
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ成功", "loop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("highCollection", "panel9", "高所物資回収", (
        <>
          <FormGroup>
            {createCheckbox("isCollected", "回収成功", "highCollection")}
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup>
            {createCheckbox("isDroppingSuccess", "自動投下成功", "automaticDrop")}
          </FormGroup>
          <FormGroup>
            {createCheckbox("isLandingSuccess", "自動着陸成功", "automaticDrop")}
          </FormGroup>
        </>
      ))}

      {createAccordion("landing", "panel12", "競技終了", (
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