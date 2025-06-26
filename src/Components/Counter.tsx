import { useState } from 'react';
import {Button, Box, Stack} from '@mui/material'
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#b3bcd1', // ボタンの背景色
  color: '#000', // ボタンの文字色
  '&:hover': {
    backgroundColor: '#1565c0', // ホバー時の背景色
  },
}));






export default function Counter() {
  const [score, setscore] = useState(0);

  function increment() {
    setscore(a => a + 1);
  }

  function decrement() {
    setscore(a => (a > 0 ? a - 1 : a)); // 0未満にならないように条件を追加
  }

  return (
    <Stack direction={'row'} spacing={1.5} sx={{justifyContent: 'center',alignItems:'center',p:0.5}}>
      <Box sx={{hight:'100%',display:'flex',justifyContent: 'center',alignItems:'center',p:0}}>{score}</Box>
      <StyledButton onClick={() => {decrement();}} variant='outlined'>-1</StyledButton>
      <StyledButton onClick={() => {increment();}} variant='outlined'>+1</StyledButton>
    </Stack>
  );
}
