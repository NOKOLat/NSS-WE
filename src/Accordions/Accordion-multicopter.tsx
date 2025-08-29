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
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick.tsx';
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

export default function Accordions_Multicopter() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleButtonClick = (id: string, event?: any) => {
    const category = 'multicopter';
    const currentNum2 = getCurrentNum2();
    const adjustedEpoch = getUnixTimestamp() + currentNum2;

    // isAreaTouchDown専用分岐
    if (id.includes('isAreaTouchDown')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          landing: {
            isAreaTouchDown: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isInAreaStop専用分岐
    if (id.includes('isInAreaStop')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          landing: {
            isInAreaStop: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // repair_timer専用分岐
    if (id.includes('repair_timer') && (id.includes('start') || id.includes('stop'))) {
      section = 'repair';
      const timeKey = id.includes('start') ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          repair: {
            epoch: {
              [timeKey]: adjustedTimestamp
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // ホバリングのisHandsOff専用分岐
    if (id === 'isHandsOff_checked' && section === 'hovering') {
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          hovering: {
            isHandsOff: true
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }
    if (id === 'isHandsOff_unchecked' && section === 'hovering') {
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          hovering: {
            isHandsOff: false
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // hovering_timer専用分岐
    if (id.includes('hovering_timer') && (id.includes('start') || id.includes('stop'))) {
      section = 'hovering';
      const timeKey = id.includes('start') ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          hovering: {
            epoch: {
              [timeKey]: adjustedTimestamp
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // ユニークミッション成功のCheckbox専用分岐
    if (id.includes('unique_isSuccess')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          uniqueMisson: {
            isSuccess: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // unique_timer専用分岐
    if (id.includes('unique_timer') && (id.includes('start') || id.includes('stop'))) {
      const timeKey = id.includes('start') ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          uniqueMisson: {
            epoch: {
              [timeKey]: adjustedTimestamp
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // failsafecontrolのisHandsOff専用分岐
    if (id.includes('isHandsOff') && section === 'failsafecontrol') {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          failsafecontrol: {
            isHandsOff: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // failsafe_timer専用分岐を修正
    if (id.includes('failsafe_timer') && (id.includes('start') || id.includes('stop'))) {
      const timeKey = id.includes('start') ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          failsafecontrol: {
            epoch: {
              [timeKey]: adjustedTimestamp
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isHandsOffのCheckbox専用分岐
    if (id.includes('isHandsOff')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          eightTurn: {
            isHandsOff: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isSuccessのCheckbox専用分岐
    if (id.includes('isSuccess')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          eightTurn: {
            isSuccess: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isLandedのCheckbox専用分岐
    if (id.includes('isLanded')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          zaqtransportation: {
            isLanded: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isTransportedのCheckbox専用分岐
    if (id.includes('isTransported')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          zaqtransportation: {
            isTransported: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // Timer系の分岐を修正：idに'timer'が含まれ、かつstart/stopが含まれる場合
    if (id.includes('timer') && (id.includes('start') || id.includes('stop'))) {
      const action = id.includes('start') ? 'start' : 'stop';
      const timeKey = action === 'start' ? 'start' : 'end';
      const adjustedTimestamp = Date.now() + currentNum2;
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          [section]: {
            epoch: {
              [timeKey]: adjustedTimestamp
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isCollectのCheckboxの特別な処理
    if (id.includes('isCollect')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          mainmission: {
            largeSupply: {
              isCollect: value
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // isDrropedToBoxのCheckboxの特別な処理
    if (id.includes('isDrropedToBox')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          mainmission: {
            largeSupply: {
              isDrropedToBox: value
            }
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // 耐故障制御のハンズオフ飛行専用分岐
    if (id.includes('failsafe_isHandsOff')) {
      const value = id.includes('checked');
      const jsonData = {
        action: "update",
        category: category,
        epoch: adjustedEpoch,
        params: {
          failsafecontrol: {
            isHandsOff: value
          }
        }
      };
      saveJsonToFile(jsonData);
      return;
    }

    // 最後に通常処理
    const [counterId, action] = id.split('_');
    let value;
    if (action === 'increment') value = 1;
    else if (action === 'decrement') value = -1;
    else if (action === 'checked') value = true;
    else if (action === 'unchecked') value = false;
    else value = 1;

    // sectionの取得
    let section = 'mainmission';
    if (event && event.target) {
      const accordionDetails = event.target.closest('.MuiAccordionDetails-root');
      const accordion = accordionDetails?.closest('.MuiAccordion-root');
      if (accordion && accordion.id) {
        section = accordion.id;
      }
    }

    const jsonData = {
      action: "update",
      category: category,
      epoch: adjustedEpoch,
      params: {
        [section]: {
          [counterId]: value
        }
      }
    };

    saveJsonToFile(jsonData);
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