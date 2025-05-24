import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import { useNavigate } from "react-router-dom";
import CommonToolbar from '../Components/CommonToolbar';

import Customized_Accordions from '../Accordion-Marti_copter';

interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
      })
    : null;
}

export default function Marcop(props: Props) {
  const navigate = useNavigate();
  const drawerWidth = 240; // Ippann.tsxと同じ値を使用
  const handleDrawerToggle = () => {
    // 必要に応じて実装
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <CommonToolbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
       
      />
      <Toolbar />
      <Container>
       
        
        <ResponsiveDrawer>
          <div>
          <Box >
        <h3>マルコプ部門</h3>
        </Box>
          <Box>
          チーム名
          </Box>
          <Box>得点</Box>
            <Stopwatch />
          </div>

<React.StrictMode>

        
            <Customized_Accordions/>
            
          </React.StrictMode>

        </ResponsiveDrawer>
      </Container>
    </React.Fragment>
  );
}








