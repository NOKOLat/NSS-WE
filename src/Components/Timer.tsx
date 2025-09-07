import { useState, useRef, useEffect } from 'react';
import { Button, Stack, Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import * as React from 'react';

const StartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2a8d88', // ボタンの背景色
  color: '#fff', // ボタンの文字色
}));

const StopButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#8d2a61', // ボタンの背景色
  color: '#fff', // ボタンの文字色
}));

type Props = {
  id?: string;
  start?: number;
  end?: number;
  onClick?: (action: 'start'|'stop'|'reset', timestamp?: number) => void;
}

export default function Stopwatch(props: Props) {
  const { id, start, end, onClick } = props;
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

  React.useEffect(() => {
    console.log(`Timer(${id}) mounted, start=${start}, end=${end}`);
  }, [id, start, end]);

  function handleStart() {
    const ts = getUnixTimestamp() + getCurrentNum2();
    console.log(`Timer(${id}) handleStart called, startProp=${!!start}, ts=${ts}`);

    // 親が onClick を渡していれば必ずコール（ローカル動作は維持）
    if (typeof onClick === 'function') {
      console.log(`Timer(${id}) calling props.onClick('start')`);
      try { onClick('start', ts); } catch (e) { console.error('props.onClick threw', e); }
    } else {
      console.warn(`Timer(${id}) props.onClick is not a function`);
    }
    if (!start) {
      localStartTimeRef.current = ts;
      setIsRunning(true);
    }
  }

  function handleStop() {
    const ts = getUnixTimestamp() + getCurrentNum2();
    console.log(`Timer(${id}) handleStop called, startProp=${!!start}, ts=${ts}`);

    // 親が onClick を渡していれば必ずコール（ローカル動作は維持）
    if (typeof onClick === 'function') {
      console.log(`Timer(${id}) calling props.onClick('stop')`);
      try { onClick('stop', ts); } catch (e) { console.error('props.onClick threw', e); }
    } else {
      console.warn(`Timer(${id}) props.onClick is not a function`);
    }
    if (!start) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    }
  }

  function handleReset() {
    const ts = getUnixTimestamp() + getCurrentNum2();
    console.log(`Timer(${id}) handleReset called, startProp=${!!start}, ts=${ts}`);

    // 親が onClick を渡していれば必ずコール（ローカル動作は維持）
    if (typeof onClick === 'function') {
      console.log(`Timer(${id}) calling props.onClick('reset')`);
      try { onClick('reset', ts); } catch (e) { console.error('props.onClick threw', e); }
    } else {
      console.warn(`Timer(${id}) props.onClick is not a function`);
    }
    if (!start) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setElapsedTime(0);
      localStartTimeRef.current = null;
    }
  }

  // ボタンは handleStart/handleStop を呼ぶだけ（props.onClick は上で一度だけ呼ぶ）
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
                console.log(`Timer(${id}) Stop button clicked`);
                handleStop();
              }}
              variant='outlined'
            >
              Stop
            </StopButton>
          ) : (
            <StartButton
              onClick={() => {
                console.log(`Timer(${id}) Start button clicked`);
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