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

  // map button id/section/action -> 送信する名称（multicopter用）
  const mapButtonName = (section: string, id: string, action?: string) => {
    // 優先的に action を使う増減系は action を考慮
    if (section === 'mainmission') {
      if (id === 'droparea') return action === 'increment' ? 'plusButton_multicopter' : 'minusButton_multicopter';
      if (id === 'box') return action === 'increment' ? 'plusButton_2_multicopter' : 'minusButton_2_multicopter';
      if (id === 'finish' || id === 'mainmission_finish') return 'mainmission_finish_multicopter';
      // 大物資関連はチェック処理で別ハンドリングすることもあるが名前だけ返す
      if (id === 'isCollect') return 'largeSupplie_isCollected';
      if (id === 'isDrropedToBox' || id === 'isDroppedToBox') return 'largeSupplie_isdroppedBox';
    }

    if (section === 'zaqtransportation') {
      if (id === 'isTransported') return 'ZAQ_isTransported';
      if (id === 'isLanded') return 'ZAQ_isLanded';
    }

    if (section === 'eightTurn') {
      if (id === 'isHandsOff') return 'eightTurn_isHandsoff_multicopter';
      if (id === 'isSuccess') return 'eightTurn_isSuccess_multicopter';
    }

    if (section === 'failsafecontrol') {
      if (id.includes('start') || id.includes('timer')) return 'failsafeControll_start';
      if (id.includes('isHandsOff')) return 'failsafeControll_isHandsoff';
    }

    if (section === 'hovering') {
      if (id.includes('start') || id.includes('timer')) return 'hovering_start';
      if (id.includes('isHandsOff')) return 'hovering_isHandsoff';
    }

    if (section === 'landing') {
      if (id === 'landing_button' || id === 'landing' || id === 'return') return 'landing_button_multicopter';
      if (id.includes('isInAreaTouchDown') || id.includes('isAreaTouchDown') || id === 'isInAreaTouchDown_multicopter') return 'isInAreaTouchDown_multicopter';
      if (id.includes('isInVertiport') || id === 'isInVertiport') return 'isInVertiport';
    }

    // デフォルト： section_id_action の形式で返す
    return `${section}_${id}${action ? `_${action}` : ''}`;
  };

  // 共通送信関数（ログ・ガード付き）
  const sendData = (buttonName: string) => {
    // 履歴保存（ローカル）
    try {
      saveJsonToFile(buttonName);
    } catch (e) {
      console.warn('saveJsonToFile failed', e);
    }

    // 送信関数の存在チェック
    if (typeof sendJsonMessage !== 'function') {
      console.error('sendJsonMessage is not a function. Did the parent pass it?', { sendJsonMessage });
      return false;
    }

    // ログを出して送信を試みる
    try {
      console.log('sendData: sending', buttonName);
      sendJsonMessage(buttonName);
      return true;
    } catch (e) {
      console.error('sendJsonMessage threw:', e);
      return false;
    }
  };

  // handleButtonClick: 第3引数で section を明示できるように変更
  const handleButtonClick = (id: string, event?: any, sectionOverride?: string) => {
    // sectionOverride があれば優先、それ以外は event から取得し、なければ mainmission をデフォルト
    let section = sectionOverride ?? 'mainmission';
    if (!sectionOverride) {
      if (event?.target) {
        const accordion = event.target.closest('.MuiAccordion-root');
        if (accordion?.id) section = accordion.id;
      }
    }

    // id を最後のパートを action (start/stop/increment/...) として正しく分割する
    const parts = id.split('_');
    const action = parts.length > 1 ? parts[parts.length - 1] : '';
    const counterId = parts.length > 1 ? parts.slice(0, -1).join('_') : parts[0];
    const currentNum2 = getCurrentNum2();

    // デバッグログ（呼ばれた id / section を表示）
    console.log('handleButtonClick called', { id, section, counterId, action });

    // Timer処理：action が start/stop のとき、counterId に timer を含むなら mapButtonName を使う
    if ((action === 'start' || action === 'stop') && counterId.toLowerCase().includes('timer')) {
      const name = mapButtonName(section, counterId, action) || `${section}_${counterId}_${action}`;
      const ok = sendData(name);
      if (!ok) console.warn('sendData failed for', name);
      return;
    }
 
     // 特殊ケース（チェック系）は名前だけ送る
     const value = id.includes('checked');
 
     const specialCases = {
       'isAreaTouchDown': () => mapButtonName('landing','isAreaTouchDown'),
       'isInAreaStop': () => mapButtonName('landing','isInAreaStop'),
       'unique_isSuccess': () => mapButtonName('uniqueMisson','isSuccess'),
       'isCollect': () => mapButtonName('mainmission','isCollect'),
       'isDrropedToBox': () => mapButtonName('mainmission','isDrropedToBox'),
       'isTransported': () => mapButtonName('zaqtransportation','isTransported'),
       'isLanded': () => mapButtonName('zaqtransportation','isLanded'),
       'failsafe_isHandsOff': () => mapButtonName('failsafecontrol','isHandsOff'),
     };
 
     for (const key of Object.keys(specialCases)) {
       if (id.includes(key)) {
         const name = (specialCases as any)[key]();
         return sendData(name ?? `${section}_${id}`);
       }
     }
 
     // isHandsOff / isSuccess のセクション依存処理（名前のみ送信）
     if (id.includes('isHandsOff')) {
       const targetSection = section === 'hovering' ? 'hovering' : 'eightTurn';
       const name = mapButtonName(targetSection, 'isHandsOff') || `${targetSection}_isHandsOff`;
       return sendData(name);
     }
     if (id.includes('isSuccess')) {
       const name = mapButtonName('eightTurn', 'isSuccess') || 'eightTurn_isSuccess';
       return sendData(name);
     }
 
     // 通常処理：増減/チェックのボタン名だけ送る
     const name = mapButtonName(section, counterId, action) || `${section}_${counterId}${action ? `_${action}` : ''}`;
     return sendData(name);
   };

  // Stopwatch イベントを正規化して handleButtonClick に渡すラッパー
  const stopwatchOnClickWrapper = (timerId: string) => (...args: any[]) => {
    // 受け取りパターンに柔軟に対応
    // パターンA: (actionId: string, event?: any)
    // パターンB: ({ action: string, timestamp?: number, event?: any })
    // パターンC: (actionId: string, timestamp?: number)
    let actionId: string | undefined;
    let event: any = undefined;

    if (typeof args[0] === 'string') {
      actionId = args[0];
      event = args[1];
    } else if (args[0] && typeof args[0].action === 'string') {
      actionId = args[0].action;
      event = args[0].event ?? undefined;
    } else {
      return;
    }

    if (!actionId) return;

    console.log('stopwatchOnClickWrapper', { timerId, actionId, args });

    // timerId からセクションを推定（failsafe 等を正しくマッピングするため）
    const inferSectionFromTimerId = (tid: string) => {
      const t = tid.toLowerCase();
      if (t.includes('failsafe')) return 'failsafecontrol';
      if (t.includes('hovering')) return 'hovering';
      if (t.includes('unique')) return 'uniqueMisson';
      if (t.includes('mainmission')) return 'mainmission';
      if (t.includes('repair')) return 'repair';
      if (t.includes('gliding')) return 'gliding';
      if (t.includes('zaq') || t.includes('zaqtransportation')) return 'zaqtransportation';
      // 未推定の場合は undefined にして event から判定させる
      return undefined;
    };

    const inferredSection = inferSectionFromTimerId(timerId);
    // 呼び出し前ログ
    console.log('stopwatchOnClickWrapper -> handleButtonClick', { timerId, actionId, inferredSection });
    handleButtonClick(`${timerId}_${actionId}`, event, inferredSection);
  };

  // スコア完了ボタン — ボタン名のみ送信するように変更
  const handleScoreComplete = () => {
    // 送信する名前はプロジェクト側の仕様に合わせて調整できます
    const name = 'uniqueMisson_score'; 
    sendData(name);
  };
  // Counter（説明文を削除し，数値を中央表示）
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
        <Box sx={{ border: '1px solid #e0e0e0', padding: 1, margin: 1, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2">{label}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>{value}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <StyledButton onClick={(e) => {
              const newValue = value + 1;
              setPendingLocalUpdates(prev => ({ ...prev, [key]: newValue }));
              setLocalCounters(prev => ({ ...prev, [key]: newValue }));
              handleButtonClick(`${id}_increment`, e);
            }}>+</StyledButton>
            <StyledButton onClick={(e) => {
              const newValue = Math.max(value - 1, 0);
              setPendingLocalUpdates(prev => ({ ...prev, [key]: newValue }));
              setLocalCounters(prev => ({ ...prev, [key]: newValue }));
              handleButtonClick(`${id}_decrement`, e);
            }}>-</StyledButton>
          </Box>
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
          {createCounter("box", "箱", "mainmission")}
          <FormGroup>
            {createCheckbox("isCollect", "大物資回収成功", "mainmission")}
            {createCheckbox("isDrropedToBox", "大物資箱投下成功", "mainmission")}
          </FormGroup>
           <Box sx={{ mt: 1 }}>
            <StyledButton
              variant="contained"
              onClick={(e) => handleButtonClick('finish', e)}
            >
              完了
            </StyledButton>
          </Box>
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
            onClick={stopwatchOnClickWrapper('failsafe_timer')}
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
            end={serverParams?.uniqueMisson?.epoch?.end}            onClick={stopwatchOnClickWrapper('unique_timer')}
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
            onClick={stopwatchOnClickWrapper('hovering_timer')}
          />
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ飛行", "hovering")}
          </FormGroup>
        </>
      ))}

      {createAccordion("repair", "panel7", "修理", (
        <Stopwatch 
          id="repair_timer"
          // 修理はサーバーへ送信しないため onClick を no-op にする
          start={serverParams?.repair?.epoch?.start}
          end={serverParams?.repair?.epoch?.end}
          onClick={(..._args: any[]) => { /* no-op: 修理タイマーは送信しない */ }}
        />
      ))}

      {createAccordion("landing", "panel8", "競技終了", (
        <FormGroup>
          {createCheckbox("isAreaTouchDown", "着陸成功", "landing")}
          {createCheckbox("isInVertiport", "パーティーポート内着陸成功", "landing")}
          {createCheckbox("landing_button", "帰還", "landing")}
        </FormGroup>
      ))}
    </div>
  );
}

