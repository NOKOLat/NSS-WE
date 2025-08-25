import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import { useNavigate } from "react-router-dom";
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick';


interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

export default function Plane(props: Props) {
  const navigate = useNavigate();
  const drawerWidth = 240; 
  const handleDrawerToggle = () => {
  };

  const handleTimerClick = (action: string, timestamp: number) => {
    // デバッグ用のログ
    console.log('Timer action:', action);
    console.log('Timestamp:', timestamp);

    const jsonData = {
      action: "update",
      category: "plane",
      epoch: Date.now(),
      params: {
        timer: {
          [action]: timestamp
        }
      }
    };

    // デバッグ用のログ
    console.log('Generated JSON:', JSON.stringify(jsonData, null, 2));
    
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
            category="plane"
            onClick={handleTimerClick}
          />
        

          <React.StrictMode>        
            <Accordions_Plane/>
          </React.StrictMode>

        </ResponsiveDrawer>
    </React.Fragment>
  );
}








