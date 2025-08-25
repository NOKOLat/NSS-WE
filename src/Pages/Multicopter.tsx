import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Multicopter from '../Accordions/Accordion-multicopter';
import Typography from '@mui/material/Typography';
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick';
import { getCurrentNum2 } from '../Data/time';
import { useNavigate } from "react-router-dom";

interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

export default function Multicopter(props: Props) {
  const navigate = useNavigate();
  const drawerWidth = 240; 
  const handleDrawerToggle = () => {
  };

  const handleTimerClick = (action: string, timestamp: number) => {
  
    const currentNum2 = getCurrentNum2();
    const jsonData = createButtonClickData('timer', currentNum2, 'multicopter');
    saveJsonToFile(jsonData);
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
            <Accordions_Multicopter/>  
          </React.StrictMode>
        </ResponsiveDrawer>
    </React.Fragment>
  );
}








