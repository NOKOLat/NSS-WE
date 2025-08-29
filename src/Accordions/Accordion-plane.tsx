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
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick.tsx';

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

const handleButtonClick = (id: string, event?: any) => {
  try {
    const category = 'plane';
    let section = 'mainmission';

    // eventからAccordionSummaryのIDを取得
    if (event && event.target) {
      const accordionSummary = event.target.closest('.MuiAccordion-root')?.querySelector('.MuiAccordionSummary-root');
      if (accordionSummary && accordionSummary.id) {
        section = accordionSummary.id;
      }
    }

    const [counterId, action] = id.split('_');
    let value;
    if (action === 'increment') value = 1;
    else if (action === 'decrement') value = -1;
    else if (action === 'checked') value = true;
    else if (action === 'unchecked') value = false;
    else value = 1;

    const jsonData = {
      action: "update",
      category: category,
      epoch: Date.now(),
      params: {
        [section]: {
          [counterId]: value
        }
      }
    };

    saveJsonToFile(jsonData);
  } catch (error) {
    console.error('Error in handleButtonClick:', error);
  }
};

export default function Accordions_Plane() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      {/* --- panel1 --- */}
      <Accordion id="plane" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="mainmission">
          <Typography component="span">メインミッション</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="success"
                  onChange={(e) => {
                    const checkboxId = `success_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="メインミッション成功"
            />
          </FormGroup>
          <Box>エリア１</Box>
          <Counter 
            id="area1" 
            onClick={(actionId, event) => handleButtonClick(`area1_${actionId}`, event)}
          />
          <Box>エリア2</Box>
          <Counter 
            id="area2"
            onClick={(actionId, event) => handleButtonClick(`area2_${actionId}`, event)}
          />
          <Box>エリア3</Box>
          <Counter  
            id="area3"
            onClick={(actionId, event) => handleButtonClick(`area3_${actionId}`, event)}
          />
          <Stopwatch 
            id="mainMissionTimer" 
            onClick={(actionId, event) => handleButtonClick(`timer_${actionId}`, event)} 
          />
        </AccordionDetails>
      </Accordion>

      {/* --- panel2 --- */}
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="collection">
          <Typography component="span">救援物資回収</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="isCollected"
                  onChange={(e) => {
                    const checkboxId = `collected_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="回収成功"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="isLanded"
                  onChange={(e) => {
                    const checkboxId = `landed_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="着陸成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel3 --- */}
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="gliding">
          <Typography component="span">無動力滑空</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stopwatch 
            id="glidingTimer"
            onClick={(actionId, event) => handleButtonClick(`gliding_timer_${actionId}`, event)}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="isHandsOff"
                  onChange={(e) => {
                    const checkboxId = `handsoff_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="ハンズオフ成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel4 --- */}
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="poleLoop">
          <Typography component="span">ポール旋回（手動操縦専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>回数</Box>
          <Counter 
            id="count"
            onClick={(actionId, event) => handleButtonClick(`count_${actionId}`, event)}
          />
          <Box>連続旋回</Box>
          <Counter 
            id="continousCount"
            onClick={(actionId, event) => handleButtonClick(`continousCount_${actionId}`, event)}
          />
        </AccordionDetails>
      </Accordion>

      {/* --- panel5 --- */}
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="horizontalLoop">
          <Typography component="span">水平旋回（自動操縦専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>回数</Box>
          <Counter 
            id="count"
            onClick={(actionId, event) => handleButtonClick(`count_${actionId}`, event)}
          />
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isContinuous" 
                  onChange={(e) => {
                    const checkboxId = `continuous_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              } 
              label="連続水平旋回" 
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel6 --- */}
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography component="span">八の字飛行</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isHandsOff"
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
                  onChange={(e) => {
                    const checkboxId = `isSuccess_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel7 --- */}
      <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
        <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
          <Typography component="span">宙返り</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>回数</Box>
          <Counter 
            id="count"
            onClick={(actionId, event) => handleButtonClick(`count_${actionId}`, event)}
          />
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isHandsOff"
                  onChange={(e) => {
                    const checkboxId = `isHandsOff_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="ハンズオフ成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel8 --- */}
      <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
        <AccordionSummary aria-controls="panel8d-content" id="panel8d-header">
          <Typography component="span">高所物資回収</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isCollected"
                  onChange={(e) => {
                    const checkboxId = `isCollected_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="回収成功"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isLanded"
                  onChange={(e) => {
                    const checkboxId = `isLanded_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="着陸成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel15 --- */}
      <Accordion expanded={expanded === 'panel15'} onChange={handleChange('panel15')}>
        <AccordionSummary aria-controls="panel15d-content" id="panel15d-header">
          <Typography component="span">上昇旋回（ハンズオフ飛行専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isSuccess"
                  onChange={(e) => {
                    const checkboxId = `isSuccess_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel16 --- */}
      <Accordion expanded={expanded === 'panel16'} onChange={handleChange('panel16')}>
        <AccordionSummary aria-controls="panel16d-content" id="panel16d-header">
          <Typography component="span">自動物資投下（ハンズオフ飛行専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isAutoTakeoff"
                  onChange={(e) => {
                    const checkboxId = `isAutoTakeoff_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="自動離陸成功"
            />
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isAutoDrop"
                  onChange={(e) => {
                    const checkboxId = `isAutoDrop_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="自動物資投下成功"
            />
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isLanded"
                  onChange={(e) => {
                    const checkboxId = `isLanded_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="着陸成功"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* --- panel9 --- */}
      <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
        <AccordionSummary aria-controls="panel9d-content" id="panel9d-header">
          <Typography component="span">修理</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stopwatch 
            id="repairTimer"
            onClick={(actionId, event) => handleButtonClick(`repairTimer_${actionId}`, event)}
          />
        </AccordionDetails>
      </Accordion>

      {/* --- panel10 --- */}
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
                  onChange={(e) => {
                    const checkboxId = `isInAreaStop_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="エリア内静止"
            />
            <FormControlLabel  
              control={
                <Checkbox 
                  id="isRunwayLanding"
                  onChange={(e) => {
                    const checkboxId = `isRunwayLanding_${e.target.checked ? 'checked' : 'unchecked'}`;
                    handleButtonClick(checkboxId, e);
                  }}
                />
              }
              label="滑走路内着陸"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}