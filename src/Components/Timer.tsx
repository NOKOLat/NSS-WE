import { useRef, useState } from 'react';
import {Button, Stack, Box} from '@mui/material'

import { styled } from '@mui/material/styles';

const StartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2a8d88', // ボタンの背景色
  color: '#fff', // ボタンの文字色
  //'&:hover': {
  //  backgroundColor: '#1565c0', // ホバー時の背景色
 // },
}));

const StopButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#8d2a61', // ボタンの背景色
    color: '#fff', // ボタンの文字色
         //   '&:hover': {
         //  backgroundColor: '#1565c0', // ホバー時の背景色
         //},
  }));
  
  const ResetButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#1d127d', // ボタンの背景色
    color: '#fff', // ボタンの文字色
    '&:hover': {
      backgroundColor: '#1565c0', // ホバー時の背景色
    },
  }));
  


interface StopwatchProps {
  id: string;
  onClick: (action: string, timestamp: number) => void;
}

function Stopwatch({ id, onClick }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function handleStart() {
    setIsRunning(true);
    const timestamp = Date.now();
    onClick('start', timestamp); // 必ず呼び出されるように修正

    intervalRef.current = window.setInterval(() => {
      setTime(prevTime => prevTime + 10);
    }, 10);
  }

  function handlePause() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    const timestamp = Date.now();
    onClick('stop', timestamp); // 必ず呼び出されるように修正
  }

  const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
  const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
  const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
  

  return (
      <Box sx={{ p: 1 }}>
        <Stack>
          <Box>計測時間</Box>
          <Box>{minutes}:{seconds}:{milliseconds}</Box>
          <Stack direction={'row'} spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            {isRunning ? (
              <StopButton 
                onClick={handlePause} 
                variant='outlined'
              >
                Stop
              </StopButton>
            ) : (
              <StartButton 
                onClick={handleStart} 
                variant='outlined'
              >
                Start
              </StartButton>
            )}
          </Stack>
        </Stack>
      </Box>
  );
}

export default Stopwatch;
