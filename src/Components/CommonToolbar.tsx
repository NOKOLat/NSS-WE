// filepath: c:\my_program\study\NSS-WE\src\Components\CommonToolbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

const CommonToolbar: React.FC<Props> = ({ drawerWidth, handleDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
         backgroundColor: '#0a647b',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Nokolat Scoring System 
          ~Web application Extension~
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CommonToolbar;