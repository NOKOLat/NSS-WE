import { getUnixTimestamp } from "../Data/time";

interface ButtonClickData {
  buttonId: string;
  epoch: number;
  action: string;
}

// 時間差を保存するためのグローバル変数
let globalTimeDifference: number = 0;

// 時間差を設定する関数
export const setTimeDifference = (difference: number): void => {
  globalTimeDifference = difference;
  console.log('Time difference set to:', globalTimeDifference);
};

// 時間差を取得する関数
export const getTimeDifference = (): number => {
  return globalTimeDifference;
};

// 調整されたUNIXタイムスタンプを取得する関数
const getAdjustedTimestamp = (): number => {
  const currentTime = getUnixTimestamp();
  const adjustedTime = currentTime + globalTimeDifference;
  console.log('Current time:', currentTime);
  console.log('Time difference:', globalTimeDifference);
  console.log('Adjusted time:', adjustedTime);
  return adjustedTime;
};

// JSONデータを生成する関数
export const createButtonClickData = (id: string): ButtonClickData => {
  return {
    buttonId: id,
    epoch: getAdjustedTimestamp(), // 時間差を加算した値を使用
    action: "button_clicked"
  };
};

// JSONファイルを保存する関数
export const saveJsonToFile = (data: ButtonClickData): void => {
  console.log('Saving JSON:', JSON.stringify(data, null, 2));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `button_${data.buttonId}_${Date.now()}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleButtonClick = (id: string) => {
  console.log('handleButtonClick called with id:', id); // ←デバッグログ追加
  const jsonData = createButtonClickData(id);
  saveJsonToFile(jsonData);
};