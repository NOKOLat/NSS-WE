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




export default function Accordions_Multicopter() {
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
         
      
          <Box>投下エリア</Box>
          <Counter id= "droparea" />
          <Box>高所運搬</Box>
          <Counter id="box" />
          
          <FormGroup>
          <FormControlLabel control={<Checkbox　id= "isCollect" sx={{ color: '#fff',  }} />} label="救援物資（大）回収成功" />
        </FormGroup>
        <FormGroup>
          <FormControlLabel control={<Checkbox id="isDrropedToBox" sx={{ color: '#fff',  }} />} label="救援物資（大）運搬成功" />
        </FormGroup>
        
          <Stopwatch></Stopwatch>

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography component="span">大型貨物運搬</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
        <FormControlLabel control={<Checkbox id="isTransported" sx={{ color: '#fff',  }}/>} label="運搬" />
         </FormGroup>

         <FormGroup>
         <FormControlLabel  control={<Checkbox id = "isLanded" sx={{ color: '#fff',  }}/>} label="着陸" />
          </FormGroup>

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography component="span">8の字飛行</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
        <FormControlLabel control={<Checkbox id="isHandsOff" sx={{ color: '#fff',  }}/>} label="ハンズオフ飛行" />
         </FormGroup>

         <FormGroup>
         <FormControlLabel  control={<Checkbox id= "isSuccess" sx={{ color: '#fff',  }}/>} label="成功" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography component="span">耐故障制御</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch></Stopwatch>
        <FormGroup>
         <FormControlLabel  control={<Checkbox id= "isHandsOff" sx={{ color: '#fff',  }}/>} label="ハンズオフ飛行" />
          </FormGroup>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography component="span">ユニークミッション</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch></Stopwatch>
        
        <FormGroup>
         <FormControlLabel  control={<Checkbox id= "isSuccess" sx={{ color: '#fff',  }}/>} label="成功" />
          </FormGroup>
          <Box id ="score" sx={{ mt: 2 }}>
            <Typography component="span" sx={{ mr: 1 }}>
              数値を入力してください:
            </Typography>
          <TextField 
            type="number"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976d2', // 枠線の色
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0', // ホバー時の枠線の色
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#004ba0', // フォーカス時の枠線の色
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff', // テキストの色
              },
              '& .MuiInputLabel-root': {
                color: '#fff', // ラベルの色
              },
            }}
            onChange={(e) => console.log(e.target.value)} // 必要に応じて値を処理
          />
         </Box>
        </AccordionDetails>
        
      </Accordion>
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography component="span">ホバリング</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stopwatch></Stopwatch>
        <FormGroup>
         <FormControlLabel  control={<Checkbox id="isHandsOff" sx={{ color: '#fff',  }}/>} label="ハンズオフ飛行" />
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
         <FormControlLabel  control={<Checkbox id= "isAreaTouchDown" sx={{ color: '#fff',  }}/>} label="エリア内接地" />
         <FormControlLabel  control={<Checkbox id= "isInAreaStop"  sx={{ color: '#fff',  }}/>} label="滑走路内着陸" />
          </FormGroup>
        </AccordionDetails>
        
     
        
      </Accordion>

    </div>
  );
}