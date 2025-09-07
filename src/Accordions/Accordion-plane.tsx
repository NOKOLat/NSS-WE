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
import Stopwatch from '../Components/Timer.tsx'  // 追加：Stopwatch を復活
import { createButtonClickData,sendJsonToServer } from '../Data/handleButtonClick.tsx';
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

export default function Accordions_Plane(props: Props) {
  const { sendJsonMessage, serverParams } = props;
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

  // map button id/section/action -> 送信する名称
  const mapButtonName = (section: string, id: string, action?: string) => {
    const key = `${section}_${id}_${action ?? ''}`;

    // メイン（飛行機）
    if (section === 'mainmission') {
      if (id === 'area1') return action === 'increment' ? 'plusButton' : 'minusButton';
      if (id === 'area2') return action === 'increment' ? 'plusButton_2' : 'minusButton_2';
      if (id === 'area3') return action === 'increment' ? 'plusButton_3' : 'minusButton_3';
      if (id === 'success') return 'successButton';
      // 完了ボタン等があれば別途マップ（
      if (id === 'finish' || id === 'mainmission_finish') return 'mainmission_finish';
    }

    // 無動力滑空
    if (section === 'gliding') {
      if (id === 'isHandsOff') return 'gliding_isHandsOff';
      if (id === 'power' || id === 'gliding_power') return 'gliding_power';
    }

    // 8の字
    if (section === 'eightTurn') {
      if (id === 'isHandsOff') return 'eightTurn_isHandsOff';
      if (id === 'isSuccess') return 'eightTurn_isSuccess';
    }

    // 救援物資回収
    if (section === 'collection') {
      if (id === 'isCollected') return 'collect_collectSuccess';
      if (id === 'isLanded') return 'collect_landingSuccess';
    }

    // 宙返り
    if (section === 'loop') {
      if (id === 'count') return action === 'increment' ? 'loop_plus' : 'loop_minus';
      if (id === 'isHandsOff') return 'loop_isHandsOff';
    }

    // 自動水平旋回（holizontalLoop）
    if (section === 'holizontalLoop') {
      if (id === 'count') return action === 'increment' ? 'holizontalLoop_plus' : 'holizontalLoop_minus';
      if (id === 'isContinous' || id === 'isContinuous') return 'holizontalLoop_continuesLoop';
    }

    // 上昇旋回
    if (section === 'risingLoop') {
      if (id === 'isSuccess') return 'risingLoop_success';
    }

    // ポール旋回
    if (section === 'poleLoop') {
      if (id === 'count') return action === 'increment' ? 'poleLoop_plus' : 'poleLoop_minus';
      if (id === 'continuousCount' || id === 'continousCount') return action === 'increment' ? 'poleLoop_continuousPlus' : 'poleLoop_Continuous_minus';
    }

    // 高所物資回収
    if (section === 'highCollection') {
      if (id === 'isCollected') return 'highcollect_collectSuccess';
      if (id === 'isLanded') return 'highcollect_landingSuccess';
    }

    // 自動投下
    if (section === 'automaticDrop') {
      if (id === 'isTakeoffSuccess') return 'automaticDrop_takeoffSuccess';
      if (id === 'isDroppingSuccess') return 'automaticDrop_Dropsuccess';
      if (id === 'isLandingSuccess') return 'automaticDrop_landingSuccess';
    }

    // 帰還 / 競技終了
    if (section === 'landing') {
      if (id === 'isAreaTouchDown' || id === 'isAreaTouchDown') return 'landing_isInAreaTouchDown';
      if (id === 'isInAreaStop') return 'landing_isAreaStop';
      if (id === 'isRunwayLanding') return 'landing_onRunway';
      if (id === 'landing_button' || id === 'landing_buuton' || id === 'return') return 'landing_buuton';
    }

    // デフォルト：section_id_action の文字列を返す
    return `${section}_${id}${action ? `_${action}` : ''}`;
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

    const [counterId, action] = id.split('_');
    const currentNum2 = getCurrentNum2();

    // 送信名を決定
    const name = mapButtonName(section, counterId, action) || `${section}_${counterId}${action ? `_${action}` : ''}`;

    // Timer処理（タイマーはボタン名のみ送信）
    if (counterId.toLowerCase().includes('timer') && (action === 'start' || action === 'stop')) {
      return sendData(name);
    }

    return sendData(name);
  };

  // 共通送信関数 — プレーン文字列で送信するように変更（引用符なし）
  const sendData = (buttonName: string) => {
    // 優先して sendMessage を使う（プレーン文字列送信用）、なければ sendJsonMessage を呼ぶ
    if (typeof sendMessage === 'function') {
      sendMessage(buttonName);
    } else if (typeof sendJsonMessage === 'function') {
      // フォールバック（送信関数が JSON を期待する場合）
      sendJsonMessage(buttonName as any);
    }
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
              // ローカル状態更新
              setLocalChecked(prev => ({ ...prev, [key]: e.target.checked }));

              // landing の「帰還」だけはプレーンなボタン名を直接送る（landing_button）
              if (section === 'landing' && id === 'landing_button') {
                // 送信はプレーン文字列 "landing_button"
                sendData('landing_button');
                return;
              }

              // 標準のチェックボックス送信（例: isAreaTouchDown_checked / unchecked）
              const checkboxId = `${id}_${e.target.checked ? 'checked' : 'unchecked'}`;
              handleButtonClick(checkboxId, e, section);
            }}
          />
        }
        label={label}
      />
    );
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

  // Stopwatch イベントを正規化して handleButtonClick に渡すラッパー（イベントに section を付与）
  const stopwatchOnClickWrapper = (timerId: string) => (...args: any[]) => {
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

    // timerId からセクションと送信対象の id を推定（gliding は特別扱い）
    const inferSectionAndIdFromTimerId = (tid: string) => {
      const t = tid.toLowerCase();
      if (t.includes('gliding')) return { section: 'gliding', id: 'power' }; // gliding の start/stop は gliding_power を送る
      if (t.includes('mainmission')) return { section: 'mainmission', id: 'timer' };
      if (t.includes('repair')) return { section: 'repair', id: 'timer' };
      if (t.includes('hovering')) return { section: 'hovering', id: 'timer' };
      if (t.includes('failsafe')) return { section: 'failsafecontrol', id: 'timer' };
      if (t.includes('unique')) return { section: 'uniqueMisson', id: 'timer' };
      if (t.includes('poleloop')) return { section: 'poleLoop', id: 'timer' };
      if (t.includes('holizontal')) return { section: 'holizontalLoop', id: 'timer' };
      if (t.includes('rising')) return { section: 'risingLoop', id: 'timer' };
      if (t.includes('automaticdrop')) return { section: 'automaticDrop', id: 'timer' };
      // デフォルト: sectionは未推定、id は元の timerId（handleButtonClick が event から section を取る）
      return { section: undefined, id: tid };
    };

    const inferred = inferSectionAndIdFromTimerId(timerId);
    // sectionOverride に inferred.section を渡す（undefined なら handleButtonClick が event から判定）
    handleButtonClick(`${inferred.id}_${actionId}`, event, inferred.section);
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
            onClick={(..._args: any[]) => {
              // no-op: 修理タイマーはサーバー送受信しない
            }}
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
            onClick={stopwatchOnClickWrapper('glidingTimer')}
          />
          <FormGroup>
            {createCheckbox("isHandsOff", "ハンズオフ成功", "gliding")}
          </FormGroup>
        </>
      ))}

      {createAccordion("landing", "panel13", "競技終了", (
        <>
        <FormGroup>
         　 {createCheckbox("landing_button", "帰還", "landing")}
             {createCheckbox("isAreaTouchDown", "エリア内接地", "landing")}
              {createCheckbox("isInAreaStop", "エリア内静止", "landing")}
              {createCheckbox("isRunwayLanding", "滑走路内着陸", "landing")}
            </FormGroup>
          </>
        ))}
    </div>
  );
}