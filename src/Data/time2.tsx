import React from 'react';



export function FormattedTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}: ${milliseconds}`;

  return (
    <div>
      現在の時刻: {formattedTime}
    </div>
  );
}