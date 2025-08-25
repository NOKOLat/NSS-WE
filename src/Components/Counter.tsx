import { useState } from 'react';
import {Button, Box, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles';
import { createButtonClickData, saveJsonToFile } from '../Data/handleButtonClick';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#b3bcd1', // ボタンの背景色
  color: '#000', // ボタンの文字色
  '&:hover': {
    backgroundColor: '#1565c0', // ホバー時の背景色
  },
}));

interface CounterProps {
  id: string;
  onClick?: (action: string) => void;
}

const Counter: React.FC<CounterProps> = ({ id, onClick }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    console.log('Increment button clicked'); // ←デバッグログ追加
    if (onClick) {
      onClick(`${id}_increment`);
    }
  };

  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1));
    console.log('Decrement button clicked'); // ←デバッグログ追加
    if (onClick) {
      onClick(`${id}_decrement`);
    }
  };

  return (
    <Box 
      sx={{ 
        p: 1,
        display: 'flex',
        justifyContent: 'center',  // 水平方向の中央揃え
        width: '100%'  // 親要素の幅いっぱいに広げる
      }}
    >
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"  // 垂直方向の中央揃え
        justifyContent="center"  // 水平方向の中央揃え
      >
        <StyledButton 
          onClick={handleDecrement}
          variant="outlined"
        >
          -
        </StyledButton>
        <Typography>{count}</Typography>
        <StyledButton 
          onClick={handleIncrement}
          variant="outlined"
        >
          +
        </StyledButton>
      </Stack>
    </Box>
  );
}

export default Counter;
