import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import Accordions_Multicopter from '../Accordions/Accordion-multicopter';
import Typography from '@mui/material/Typography';

export default function Multicopter() {
  return (
    <React.Fragment>
        <ResponsiveDrawer>
    
          <Typography variant="h5" component="h3" gutterBottom>マルコプ部門</Typography>
          <Typography variant="body1">チーム名</Typography>
          <Typography variant="body1">得点</Typography>
         
          <Stopwatch />

          <React.StrictMode>
            <Accordions_Multicopter/>  
          </React.StrictMode>
        </ResponsiveDrawer>
    </React.Fragment>
  );
}








