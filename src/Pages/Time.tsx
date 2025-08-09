import * as React from 'react';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import '../App.css';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import UnixTimestamp from '../Data/time';
import {FormattedTime} from '../Data/time2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
        <ResponsiveDrawer>
          <Typography variant="h5" component="h3" gutterBottom>時間合わせ</Typography>
          <UnixTimestamp />
        　<FormattedTime />  
         <Typography variant="body1">あなたのデバイスとホストのデバイスの時間差を入力してください．</Typography>
        <Box id ="time_difference" sx={{ mt: 2 }}>
            <Typography component="span" sx={{ mr: 1 }}>
              数値を入力してください:
            </Typography>
          <TextField 
            type="number"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976d2', // 枠線の色
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0', // ホバー時の枠線の色
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#004ba0', // フォーカス時の枠線の色
                },
              },
              '& .MuiInputBase-input': {
                color: '#000', // テキストの色
              },
              '& .MuiInputLabel-root': {
                color: '#000', // ラベルの色
              },
            }}
            onChange={(e) => console.log(e.target.value)} // 必要に応じて値を処理
          />
         </Box>

         
        </ResponsiveDrawer>
    </React.Fragment>
  );
}


