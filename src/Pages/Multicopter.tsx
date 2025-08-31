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

  // WebSocket送信関数を取得
  const { sendJsonMessage } = useWebSocket('ws://localhost:8765', {
    share: true,
    shouldReconnect: () => true,
  });

  const handleTimerClick = (action: string, timestamp: number) => {
    const currentNum2 = getCurrentNum2();
    const actionKey = action === 'stop' ? 'end' : action;
    const adjustedEpoch = getUnixTimestamp() + currentNum2;
    const adjustedTimestamp = timestamp + currentNum2;

    const jsonData = {
      action: "update",
      category: "multicopter",
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
        <Typography variant="h5" component="h3" gutterBottom>マルコプ部門</Typography>
        <Typography variant="body1">チーム名</Typography>
        <Typography variant="body1">得点</Typography>
        <Stopwatch
          id="timer"
          onClick={handleTimerClick}
        />
        <React.StrictMode>
          <Accordions_Multicopter sendJsonMessage={sendJsonMessage}/>  
        </React.StrictMode>
      </ResponsiveDrawer>
    </React.Fragment>
  );
}








