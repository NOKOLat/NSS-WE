import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';
import { saveJsonToFile ,sendJsonToServer} from '../Data/handleButtonClick';
import { getCurrentNum2, getUnixTimestamp } from '../Data/time';
import useWebSocket from 'react-use-websocket';


// ErrorBoundary を同ファイルに追加
class ErrorBoundary extends React.Component<{children?: React.ReactNode}, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: React.ErrorInfo) {
    // エラー情報は必要に応じてサーバー送信やログ保存に使えます
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>エラーが発生しました。再読み込みしてください。</div>;
    }
    return this.props.children ?? null;
  }
}

export default function Plane() {
  // WebSocket送信関数を取得（プレーン文字列送信用の sendMessage を含む）
  const { sendJsonMessage, sendMessage, lastJsonMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8765', {
     share: true,
     shouldReconnect: () => true,
   });
 
   // サーバーから受信したparamsを保持
   const [serverParams, setServerParams] = React.useState<any>({});
 
   React.useEffect(() => {
     if (lastJsonMessage && lastJsonMessage.action === "update" && lastJsonMessage.category === "plane") {
       setServerParams(lastJsonMessage.params);
     }
   }, [lastJsonMessage]);
 
   // (デバッグログは削除) 必要なら別途ログ出力を追加してください

   const handleTimerClick = (action: string, timestamp?: number) => {
     const buttonName = action === 'stop' ? 'gameFinish_Button' : 'gameStart_Button';
     // ログを出して送信の有無を確認
     console.log('handleTimerClick called', { action, timestamp, buttonName, sendMessageType: typeof sendMessage, readyState });
     saveJsonToFile(buttonName);
     if (typeof sendMessage === 'function') {
       try {
         sendMessage(buttonName);
         console.log('sent via sendMessage:', buttonName);
       } catch (e) {
         console.error('sendMessage failed:', e);
       }
     } else if (typeof sendJsonMessage === 'function') {
       try {
         sendJsonMessage(buttonName as any);
         console.log('sent via sendJsonMessage (fallback):', buttonName);
       } catch (e) {
         console.error('sendJsonMessage failed:', e);
       }
     } else {
       console.warn('no sending function available');
     }
   };
 
   const stopwatchOnClickWrapper = (...args: any[]) => {
     console.log('stopwatchOnClickWrapper args:', args);
     if (typeof args[0] === 'string' && (args[0] === 'start' || args[0] === 'stop')) {
       handleTimerClick(args[0], typeof args[1] === 'number' ? args[1] : Date.now());
     } else if (args[0] && typeof args[0].action === 'string' && (args[0].action === 'start' || args[0].action === 'stop')) {
       handleTimerClick(args[0].action, args[0].timestamp ?? Date.now());
     } else {
       console.log('stopwatchOnClickWrapper: unknown args, ignoring');
     }
   };
 
   return (
     <React.Fragment>
         <ErrorBoundary>
           <ResponsiveDrawer>
            <Typography variant="h5" component="h3" gutterBottom>一般部門</Typography>
            <Typography variant="body1">チーム名</Typography>
            <Typography variant="body1">得点</Typography>
            <Stopwatch
              id="timer"
              onClick={stopwatchOnClickWrapper}
              start={serverParams?.timer?.start}
              end={serverParams?.timer?.end}
            />
            <React.StrictMode>        
              <Accordions_Plane 
                sendJsonMessage={sendJsonMessage}
                sendMessage={sendMessage}
                serverParams={serverParams}
              />
            </React.StrictMode>
          </ResponsiveDrawer>
         </ErrorBoundary>
      </React.Fragment>
    );
  }