import { getUnixTimestamp } from "../Data/time";

interface ButtonClickData {
  buttonId: string;
  epoch: number;
  action: string;
}

// JSONデータを生成する関数
export const createButtonClickData = (id: string): ButtonClickData => {
  return {
    buttonId: id,
    epoch: getUnixTimestamp(),
    action: "button_clicked"
  };
};

// JSONファイルを保存する関数
export const saveJsonToFile = (data: ButtonClickData): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `button_${data.buttonId}_${Date.now()}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};