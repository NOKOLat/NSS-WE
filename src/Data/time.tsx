import React from 'react';

export default function UnixTimestamp() {
  // 現在の日付オブジェクトを取得
  const now = new Date();

  // UNIXタイムスタンプを取得（ミリ秒単位なので、1000で割って秒単位に変換）
  const unixTimestamp = Math.floor(now.getTime() / 1000);

  return (
    <div>
      現在のUNIXタイムスタンプ: {unixTimestamp}
    </div>
  );
}