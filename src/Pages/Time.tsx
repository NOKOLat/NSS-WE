import * as React from 'react';
import { useState, useEffect } from 'react'; // ① useEffectをインポート
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import '../App.css';
import Typography from '@mui/material/Typography';
import UnixTimestamp, { getUnixTimestamp } from '../Data/time'; // ② getUnixTimestampもインポート
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { RealtimeUnixTimestamp } from '../Data/time';
import { setTimeDifference } from '../Data/handleButtonClick'; // 追加


interface Props {
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
}

export default function Plane(props: Props) {
  const [timeDifference, setTimeDifferenceState] = useState(0); 
  const [initialTimestamp, setInitialTimestamp] = useState(0); // ③ 初期タイムスタンプのstateを定義
  const [displayTimestamp, setDisplayTimestamp] = useState(0); // 追加

  // ④ コンポーネントがマウントされた時に一度だけ実行
  useEffect(() => {
    setInitialTimestamp(getUnixTimestamp());
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    setTimeDifferenceState(newValue ); 
  };

  const handleUpdate = () => {
    console.log('Update button clicked, timeDifference:', timeDifference); // ←追加
    setTimeDifference(timeDifference);
    const newTimestamp = initialTimestamp + timeDifference;
    setDisplayTimestamp(newTimestamp);
  };

  return (
    <React.Fragment>
        <ResponsiveDrawer>
          <Typography variant="h5" component="h3" gutterBottom>時間合わせ</Typography>
          {/* ⑤ 両方の値をpropsとして渡す */}
          <UnixTimestamp 
            actualTimestamp={initialTimestamp}
            timeDifference={timeDifference}
          /> 
          <Typography variant="body1">あなたのデバイスとホストのデバイスの時間差を入力してください．</Typography>
        <Box id ="time_difference" sx={{ mt: 2 }}>
            <Typography component="span" sx={{ mr: 1 }}>
              数値を入力してください:
            </Typography>
          <TextField 
            type="number"
            variant="outlined"
            size="small"
            onChange={handleTimeChange} 
          />
          <RealtimeUnixTimestamp timeDifference={timeDifference} />
         </Box>
         <button onClick={handleUpdate}>Update Time Difference</button> {/* 追加 */}
        </ResponsiveDrawer>
    </React.Fragment>
  );
}