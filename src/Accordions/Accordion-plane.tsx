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
import Counter from '../Components/Counter.tsx'
import Stopwatch from '../Components/Timer.tsx'


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
  margin: '0 auto', // 中央揃え
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




export default function Accordions_Plane() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography component="span">メインミッション</Typography>
        </AccordionSummary>
        <AccordionDetails>
         
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="メインミッション成功" />
        </FormGroup>

          <Box>エリア１</Box>
          <Counter></Counter>
          <Box>エリア2</Box>
          <Counter></Counter>
          <Box>エリア3</Box>
          <Counter></Counter>
          <Stopwatch></Stopwatch>

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography component="span">救援物資回収</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
        <FormControlLabel control={<Checkbox />} label="回収成功" />
         </FormGroup>

         <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="着陸成功" />
          </FormGroup>

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography component="span">無動力滑空</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stopwatch></Stopwatch>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography component="span">ポール旋回（手動操縦専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box>回数</Box>
        <Counter></Counter>
        <Box>連続旋回</Box>
          <Counter></Counter>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography component="span">水平旋回（自動操縦専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box>回数</Box>
        <Counter></Counter>

        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="連続水平旋回" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography component="span">八の字飛行</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="ハンズオフ飛行" />
          </FormGroup>
          <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="成功" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
        <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
          <Typography component="span">宙返り</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box>回数</Box>
        <Counter></Counter>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
        <AccordionSummary aria-controls="panel8d-content" id="panel8d-header">
          <Typography component="span">高所物資回収</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="回収成功" />
          </FormGroup>
          <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="着陸成功" />
          </FormGroup>
        </AccordionDetails>
      
      </Accordion>


      <Accordion expanded={expanded === 'panel15'} onChange={handleChange('panel15')}>
        <AccordionSummary aria-controls="panel15d-content" id="panel15d-header">
          <Typography component="span">上昇旋回（ハンズオフ飛行専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="成功" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>

      <Accordion expanded={expanded === 'panel16'} onChange={handleChange('panel16')}>
        <AccordionSummary aria-controls="panel16d-content" id="panel16d-header">
          <Typography component="span">自動物資投下（ハンズオフ飛行専用）</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="自動離陸成功" />
         <FormControlLabel  control={<Checkbox />} label="自動物資投下成功" />
         <FormControlLabel  control={<Checkbox />} label="着陸成功" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>





      <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
        <AccordionSummary aria-controls="panel9d-content" id="panel9d-header">
          <Typography component="span">修理</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch></Stopwatch>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel10'} onChange={handleChange('panel10')}>
        <AccordionSummary aria-controls="panel10d-content" id="panel10d-header">
          <Typography component="span">競技終了</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
         <FormControlLabel  control={<Checkbox />} label="エリア内接地" />
         <FormControlLabel  control={<Checkbox />} label="エリア内静止" />
         <FormControlLabel  control={<Checkbox />} label="滑走路内着陸" />
          </FormGroup>
        </AccordionDetails>
        </Accordion>
        
        
      

    </div>
  );
}