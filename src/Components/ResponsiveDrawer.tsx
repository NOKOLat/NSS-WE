// filepath: c:\my_program\study\NSS-WE\src\Components\ResponsiveDrawer.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import WindPowerIcon from '@mui/icons-material/WindPower';
import CommonToolbar from './CommonToolbar';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['一般部門', 'マルコプ部門'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (text === '一般部門') {
                  navigate('/');
                } else if (text === 'マルコプ部門') {
                  navigate('/marcop');
                }
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <AirplanemodeActiveIcon /> : <WindPowerIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CommonToolbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}