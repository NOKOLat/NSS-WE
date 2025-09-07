import { useState, useRef, useEffect } from 'react';
import { Button, Stack, Box } from '@mui/material'
import { styled } from '@mui/material/styles';

const StartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2a8d88', // ボタンの背景色
  color: '#fff', // ボタンの文字色
}));

const StopButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#8d2a61', // ボタンの背景色
  color: '#fff', // ボタンの文字色
}));

interface StopwatchProps {
  id: string;
  onClick: (action: string, timestamp: number) => void;
  start?: number;
  end?: number;
}

function Stopwatch({ id, onClick, start, end }: StopwatchProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // ローカルモード用の開始時間を保持
  const localStartTimeRef = useRef<number | null>(null);

  // 外部で定義された関数を呼び出すための仮実装
  // 実際にはmulticopter.tsxなどからインポートされます
  const getUnixTimestamp = () => Math.floor(Date.now());
  const getCurrentNum2 = () => 0; 

  useEffect(() => {
    // サーバーモードのロジック
    if (start) {
      if (!end) {
        // タイマー開始
        setIsRunning(true);
        intervalRef.current = window.setInterval(() => {
          setElapsedTime(getUnixTimestamp() + getCurrentNum2() - start);
        }, 10);
      } else {
        // タイマー停止
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setElapsedTime(end - start);
        setIsRunning(false);
      }
    } 
    // ローカルモードのロジック（サーバーからのstartがない場合）
    else {
      // isRunningがtrueの場合のみタイマーを開始
      if (isRunning) {
        intervalRef.current = window.setInterval(() => {
          setElapsedTime(getUnixTimestamp() + getCurrentNum2() - (localStartTimeRef.current || 0));
        }, 10);
      } else {
        // isRunningがfalseの場合、タイマーを停止
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }

    // クリーンアップ関数
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start, end, isRunning]);

  function handleStart() {
    if (start) {
      onClick('start', getUnixTimestamp() + getCurrentNum2());
    } else {
      localStartTimeRef.current = getUnixTimestamp() + getCurrentNum2();
      setIsRunning(true);
    }
  }

  function handleStop() {
    if (start) {
      onClick('stop', getUnixTimestamp() + getCurrentNum2());
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    }
  }
  
  function handleReset() {
    if (start) {
      onClick('reset', getUnixTimestamp() + getCurrentNum2());
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setElapsedTime(0);
      localStartTimeRef.current = null;
    }
  }

  const milliseconds = `0${Math.floor(elapsedTime % 1000 / 10)}`.slice(-2);
  const seconds = `0${Math.floor(elapsedTime / 1000) % 60}`.slice(-2);
  const minutes = `0${Math.floor(elapsedTime / 60000) % 60}`.slice(-2);

  return (
    <Box sx={{ p: 1 }} data-timer-id={id}>
      <Stack>
        <Box>計測時間</Box>
        <Box>{minutes}:{seconds}:{milliseconds}</Box>
        <Stack direction={'row'} spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          {isRunning ? (
            <StopButton
              onClick={() => {
                const ts = Date.now();
                if (typeof onClick === 'function') onClick('stop', ts);
                handleStop();
              }}
              variant='outlined'
            >
              Stop
            </StopButton>
          ) : (
            <StartButton
              onClick={() => {
                const ts = Date.now();
                if (typeof onClick === 'function') onClick('start', ts);
                handleStart();
              }}
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
