import { useState } from 'react';
import {Button, Box, Stack} from '@mui/material'

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
      <Button onClick={() => {decrement();}} variant='outlined'>-1</Button>
      <Button onClick={() => {increment();}} variant='outlined'>+1</Button>
    </Stack>
  );
}
