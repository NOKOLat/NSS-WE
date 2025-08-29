import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';
import { saveJsonToFile } from '../Data/handleButtonClick';
import { getCurrentNum2, getUnixTimestamp } from '../Data/time';


export default function Plane() {
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
          />
          <React.StrictMode>        
            <Accordions_Plane/>
          </React.StrictMode>
        </ResponsiveDrawer>
    </React.Fragment>
  );
}