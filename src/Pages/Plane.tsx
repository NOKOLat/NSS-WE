import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick';
import { getCurrentNum2 } from '../Data/time';


export default function Plane() {

  const handleTimerClick = (action: string, timestamp: number) => {
    // Time.tsxで入力された最新のnum2の値を取得
    const currentNum2 = getCurrentNum2();
    const jsonData = createButtonClickData('timer', currentNum2, 'plane');
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








