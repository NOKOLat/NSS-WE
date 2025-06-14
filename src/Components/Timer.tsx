import { useRef, useState } from 'react';
import {Button, Stack, Box} from '@mui/material'

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    const intervalRef = useRef<number | null>(null);

    function handleStart() {
        setIsRunning(true);
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
    }

    function handleReset() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null; 
        }
        setIsRunning(false);
        setTime(0);
    }

    const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
  

    return (
        <Box sx={{p:1}}>
        <Stack>
            <Box>計測時間</Box>
            <Box>{minutes}:{seconds}:{milliseconds}</Box>
            <Stack direction={'row'} spacing={1} sx={{justifyContent: 'center',alignItems:'center'}}>
            {isRunning ? (
                <Button onClick={handlePause} variant='outlined'>Stop</Button>
            ) : (
                <Button onClick={handleStart} variant='outlined'>Start</Button>
            )}
            <Button onClick={handleReset} variant='outlined'>Reset</Button>
            </Stack>
        </Stack> 
        </Box>
    );
}

export default Stopwatch;
