import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// ページロード時のUNIXタイム（ms）を表示するコンポーネント
export function InitialUnixTime() {
  const [initialUnixTime] = React.useState(Math.floor(Date.now()));
  return (
    <div style={{ color: 'black', marginBottom: '10px' }}>
      ページロード時のUNIXタイム（ms）: {initialUnixTime}
    </div>
  );
}
import React, { useState, useEffect } from 'react';

// グローバルにnum2の値を保持する変数
let globalNum2: number = 0;

// Time.tsxで入力されたnum2の値を他のページから取得する関数
export function getCurrentNum2(): number {
  return globalNum2;
}

function unixtime() {
  // num1: ページロード時のUNIXタイム（ms）
  const [num1, setNum1] = useState(0);
  // num2: ユーザー入力欄（初期値は0）
  const [num2, setNum2] = useState(0);
  // result: num1とnum2の合計
  const [result, setResult] = useState(num1 + Number(num2));

  // num1またはnum2が変化したらresultを更新
  useEffect(() => {
    setResult(num1 + Number(num2));
  }, [num1, num2]);

  // num1をリアルタイムで更新
  function updateNum1Effect() {
    var timer = setInterval(function updateNum1() {
      setNum1(Math.floor(Date.now()));
    }, 1);
    return function cleanup() {
      clearInterval(timer);
    };
  }
  useEffect(updateNum1Effect, []);

  // 入力欄に値が入れられた時の処理
  function handleNum2Change(e: React.ChangeEvent<HTMLInputElement>) {
    // 入力値を受け取る
    const newNum2 = Number(e.target.value);
    // 受け取った値をnum2に入れる
    setNum2(newNum2);
    // グローバル変数も更新して他のページで使えるようにする
    globalNum2 = newNum2;
  }

  const unixResultValue = getUnixResult(num2);
  return (
    <div style={{ maxWidth: 300, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ marginBottom: '10px' }}>
          <Typography
            variant="body1"
            component="span"
            style={{ color: 'black', marginBottom: '10px' }}
          >
            現在のUNIXタイム（ms）: {num1}
          </Typography>
        </div>
        <Typography variant="body1" style={{ color: 'black', marginBottom: '8px'　 }}>
          入力値:
        </Typography>
        <TextField
          type="number"
          value={num2}
          onChange={handleNum2Change}
          placeholder="数値を入力"
          variant="outlined"
          size="small"
          sx={{ width: '180px', input: { color: 'black' } }}
        />
      </div>
      <div style={{ marginBottom: 15 }} />
      <div>
        <span　style={{ color: 'black' }}>変更後: {result}</span>
      </div>
    </div>
  );
}

export default unixtime;

// UNIXタイム(ms)と引数num2の合計を返す関数
export function getUnixResult(num2: number): number {
  return Math.floor(Date.now()) + Number(num2);
}

// 現在のUNIXタイムスタンプを返す関数
export function getUnixTimestamp(): number {
  return Math.floor(Date.now());
}