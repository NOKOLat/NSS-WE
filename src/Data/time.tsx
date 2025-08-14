import React from 'react';

// propsの型を定義
type UnixTimestampProps = {
  actualTimestamp: number;
  timeDifference: number;
};

// UNIXタイムスタンプを返す関数（元の実装は維持）
export const getUnixTimestamp = (): number => {
  return Math.floor(new Date().getTime());
};

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