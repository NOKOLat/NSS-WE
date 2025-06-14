import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import { useNavigate } from "react-router-dom";
import CommonToolbar from '../Components/CommonToolbar';
import Accordions_Plane from '../Accordions/Accordion-plane';

interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

export default function Plane(props: Props) {
  const navigate = useNavigate();
  const drawerWidth = 240; 
  const handleDrawerToggle = () => { 
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
        <h3>一般部門</h3>
        </Box>
          <Box>
          チーム名
          </Box>
          <Box>得点</Box>
            <Stopwatch />
          </div>

<React.StrictMode>

        
            <Accordions_Plane/>
            
          </React.StrictMode>

        </ResponsiveDrawer>
      </Container>
    </React.Fragment>
  );
}








