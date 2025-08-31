import { getUnixResult } from './time';

interface ButtonClickData {
  buttonId: string;
  Category:string;
  epoch: number;
  action: string;
}


// JSONデータを生成する関数
export const createButtonClickData = (id: string, num2: number, category: string): ButtonClickData => {
  return {
    buttonId: id,
    Category: category,
    epoch: getUnixResult(num2), // time.tsxで入力されたnum2を反映
    action: "button_clicked"
  };
};

// JSONファイルを保存する関数
export const saveJsonToFile = (data: ButtonClickData): void => {

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `button_${Date.now()}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleButtonClick = (id: string, num2: number, category: string) => {
  const jsonData = createButtonClickData(id, num2, category)
  saveJsonToFile(jsonData);
};


//JSONファイルを送信する関数
export const sendJsonToServer = (jsonData: any, sendJsonMessage?: (data: any) => void) => {
  if (sendJsonMessage) {
    sendJsonMessage(jsonData);
  }
};

