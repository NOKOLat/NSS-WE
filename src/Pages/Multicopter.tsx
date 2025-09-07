import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Multicopter from '../Accordions/Accordion-multicopter';
import Typography from '@mui/material/Typography';
import { sendJsonToServer} from '../Data/handleButtonClick';
import { getCurrentNum2, getUnixTimestamp } from '../Data/time';
import { useNavigate } from "react-router-dom";
import useWebSocket from 'react-use-websocket'; 

interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

export default function Multicopter(props: Props) {
  const navigate = useNavigate();
  const drawerWidth = 240; 

  // WebSocket送信関数を取得（送信状態確認用 readyState も取得）
  const { sendJsonMessage, sendMessage, lastJsonMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8765', {
    share: true,
    shouldReconnect: () => true,
  });

  // サーバーから受信したparamsを保持
  const [serverParams, setServerParams] = React.useState<any>({});

  React.useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.action === "update" && lastJsonMessage.category === "multicopter") {
      setServerParams(lastJsonMessage.params);
    }
  }, [lastJsonMessage]);

  // 直近送信記録（重複送信抑止）
  const lastSentRef = React.useRef<{[name: string]: number}>({});
  const DEDUPE_MS = 500; // 500ms以内の同名送信を無視

  // 共通送信関数（readyState ガード＋ログ＋デデュープ）
  const sendData = (buttonName: string) => {
    

    // 重複抑止
    const now = Date.now();
    const last = lastSentRef.current[buttonName] ?? 0;
    if (now - last < DEDUPE_MS) {
      console.warn('sendData: dedupe skip', { buttonName, since: now - last });
      return false;
    }
    lastSentRef.current[buttonName] = now;

    // WebSocket が OPEN でなければ送らない
    if (readyState !== 1) {
      console.warn('WebSocket not open, skipping send:', { buttonName, readyState });
      return false;
    }

    const sender = typeof sendMessage === 'function' ? sendMessage : (typeof sendJsonMessage === 'function' ? sendJsonMessage : null);
    if (!sender) {
      console.error('No send function available', { sendMessage, sendJsonMessage });
      return false;
    }

    try {
      console.log('Multicopter sendData:', buttonName);
      sender(buttonName as any);
      return true;
    } catch (e) {
      console.error('send failed', e);
      return false;
    }
  };

  // Start/Stop 押下時の処理（ボタン名決定して sendData 経由で送信）
  const handleTimerClick = (action: string, timestamp?: number) => {
    const buttonName = action === 'stop' ? 'gameFinish_Button' : 'gameStart_Button';
    sendData(buttonName);
  };

  // wrapper（既にあるなら同等のものが必要）
  const stopwatchOnClickWrapper = (...args: any[]) => {
    console.log('stopwatchOnClickWrapper called', args);
    if (typeof args[0] === 'string') {
      const action = args[0];
      const ts = typeof args[1] === 'number' ? args[1] : Date.now();
      handleTimerClick(action, ts);
      return;
    }
    if (args[0] && typeof args[0].action === 'string') {
      handleTimerClick(args[0].action, args[0].timestamp ?? Date.now());
      return;
    }
    console.warn('stopwatchOnClickWrapper: unexpected args', args);
  };

  return (
    <React.Fragment>
      <ResponsiveDrawer>
        <Typography variant="h5" component="h3" gutterBottom>マルコプ部門</Typography>
        <Typography variant="body1">チーム名</Typography>
        <Typography variant="body1">得点</Typography>
        {/* Stopwatch 呼び出し（onClick を渡す） */}
        <Stopwatch
          id="timer"
          start={serverParams?.timer?.start}
          end={serverParams?.timer?.end}
          onClick={stopwatchOnClickWrapper}
        />
        <React.StrictMode>
          <Accordions_Multicopter 
            sendJsonMessage={sendJsonMessage}
            sendMessage={sendMessage}
            serverParams={serverParams}
          />
        </React.StrictMode>
      </ResponsiveDrawer>
    </React.Fragment>
  );
}