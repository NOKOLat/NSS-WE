import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Multicopter from '../Accordions/Accordion-multicopter';
import Typography from '@mui/material/Typography';
import { saveJsonToFile ,sendJsonToServer} from '../Data/handleButtonClick';
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

  // WebSocket送信関数を取得（プレーン文字列送信用の sendMessage を含む）
  const { sendJsonMessage, sendMessage, lastJsonMessage, lastMessage } = useWebSocket('ws://192.168.10.164:8765', {
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

  // Start/Stop 押下時にプレーン文字列を送信（JSONは生成しない）
  const handleTimerClick = (action: string, timestamp?: number) => {
    const buttonName = action === 'stop' ? 'gameFinish_Button' : 'gameStart_Button';
    saveJsonToFile(buttonName);
    if (typeof sendMessage === 'function') {
      sendMessage(buttonName);
    } else if (typeof sendJsonMessage === 'function') {
      sendJsonMessage(buttonName as any);
    }
  };

  // Stopwatch の onClick 引数を安全に受け取り、start/stop を検出して送信する wrapper
  const stopwatchOnClickWrapper = (...args: any[]) => {
    if (typeof args[0] === 'string' && (args[0] === 'start' || args[0] === 'stop')) {
      handleTimerClick(args[0], typeof args[1] === 'number' ? args[1] : Date.now());
    } else if (args[0] && typeof args[0].action === 'string' && (args[0].action === 'start' || args[0].action === 'stop')) {
      handleTimerClick(args[0].action, args[0].timestamp ?? Date.now());
    }
  };

  return (
    <React.Fragment>
      <ResponsiveDrawer>
        <Typography variant="h5" component="h3" gutterBottom>マルコプ部門</Typography>
        <Typography variant="body1">チーム名</Typography>
        <Typography variant="body1">得点</Typography>
        <Stopwatch
          id="timer"
          onClick={(...args: any[]) => stopwatchOnClickWrapper(...args)}
          start={serverParams?.timer?.start}
          end={serverParams?.timer?.end}
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