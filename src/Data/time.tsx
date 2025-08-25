import React, { useState, useEffect } from 'react';

// propsの型を定義
type UnixTimestampProps = {
  actualTimestamp: number;
  timeDifference: number;
};

// UNIXタイムスタンプを返す関数（元の実装は維持）
export const getUnixTimestamp = (): number => {
  return Math.floor(new Date().getTime());
};

// リアルタイムUNIXタイムスタンプ表示コンポーネント
export function RealtimeUnixTimestamp({ timeDifference = 0 }: { timeDifference?: number }) {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  useEffect(() => {
    // 初回設定
    setCurrentTimestamp(getUnixTimestamp() + timeDifference);


    const interval = setInterval(() => {
      setCurrentTimestamp(getUnixTimestamp() + timeDifference);
    }, 1);

    // クリーンアップ
    return () => clearInterval(interval);
  }, [timeDifference]); // timeDifferenceが変更されたときも再実行

  return (
    <div>
      <p>現在のUNIXタイムスタンプ: {currentTimestamp}</p>
    </div>
  );
}

// propsとして両方の値を受け取るコンポーネント
export default function UnixTimestamp({ actualTimestamp, timeDifference }: UnixTimestampProps) {
  // 渡された実際のタイムスタンプに時間差を加算
  const newTimestamp = Math.floor(actualTimestamp + timeDifference); 
  
  return (
    <div>
      <p>実際のUNIXタイムスタンプ: {actualTimestamp}</p>
      <p>調整後のUNIXタイムスタンプ: {newTimestamp}</p>
    </div>
  );
}