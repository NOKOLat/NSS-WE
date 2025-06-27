import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import Stopwatch from '../Components/Timer';
import '../App.css';
import { useNavigate } from "react-router-dom";
import CommonToolbar from '../Components/CommonToolbar';
import Accordions_Plane from '../Accordions/Accordion-plane';
import Typography from '@mui/material/Typography';


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
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>

      <CssBaseline />
      <CommonToolbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Toolbar />
      <Container>
       
        <ResponsiveDrawer>
         
          
            <Typography variant="h5" component="h3" gutterBottom>
              一般部門
            </Typography>
        
        
           <Typography variant="body1">チーム名</Typography>
        
           <Typography variant="body1">得点</Typography>
          <Stopwatch />
        

<React.StrictMode>

        
            <Accordions_Plane/>
            
          </React.StrictMode>

        </ResponsiveDrawer>
      </Container>
    </div>
  );
}








