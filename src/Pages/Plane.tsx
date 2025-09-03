import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';
import { saveJsonToFile ,sendJsonToServer} from '../Data/handleButtonClick';
import { getCurrentNum2, getUnixTimestamp } from '../Data/time';
import useWebSocket from 'react-use-websocket';


export default function Plane() {
  const { sendJsonMessage, lastJsonMessage, lastMessage } = useWebSocket('ws://localhost:8765', {
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

  React.useEffect(() => {
    if (lastJsonMessage) {
      console.log('受信したJSON:', lastJsonMessage);
    }
    if (lastMessage) {
      console.log('受信した生メッセージ:', lastMessage.data);
    }
  }, [lastJsonMessage, lastMessage]);

  const handleTimerClick = (action: string, timestamp: number) => {
    const currentNum2 = getCurrentNum2();

    // stopの場合はendに変換
    const actionKey = action === 'stop' ? 'end' : action;

    const adjustedEpoch = getUnixTimestamp() + currentNum2;
    const adjustedTimestamp = timestamp + currentNum2;

    const jsonData = {
      action: "update",
      category: "plane",
      epoch: adjustedEpoch,
      params: {
        timer: {
          [actionKey]: adjustedTimestamp
        }
      }
    };

    saveJsonToFile(jsonData);
    sendJsonToServer(jsonData, sendJsonMessage); 
  };

  return (
    <React.Fragment>
        <ResponsiveDrawer>
          <Typography variant="h5" component="h3" gutterBottom>一般部門</Typography>
          <Typography variant="body1">チーム名</Typography>
          <Typography variant="body1">得点</Typography>
          <Stopwatch 
            id="timer"
            onClick={handleTimerClick}
            start={serverParams?.timer?.start}
            end={serverParams?.timer?.end}
          />
          <React.StrictMode>        
            <Accordions_Plane 
              sendJsonMessage={sendJsonMessage}
              serverParams={serverParams}
            />  
          </React.StrictMode>
        </ResponsiveDrawer>
    </React.Fragment>
  );
}