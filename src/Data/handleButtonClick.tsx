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
export const saveJsonToFile = (data: any) => {
  // data が文字列ならそのまま、そうでなければ JSON に変換して保存する
  const payload = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  // ...既存のファイル保存ロジックを使用（例: ダウンロードや fs 書き出し）...
  // 例（ブラウザでダウンロードする実装がある場合）:
  const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'last_sent.txt';
  a.click();
  URL.revokeObjectURL(url);
};

export const sendJsonToServer = (ws: WebSocket | any, data: any) => {
  // 送信も文字列ならそのまま、オブジェクトなら JSON 文字列化
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  if (ws && typeof ws.send === 'function') {
    ws.send(payload);
  } else {
    // もし sendJsonToServer が内部で websocket を作っているならそちらに合わせてください
    console.warn('sendJsonToServer: websocket not provided or send not a function');
  }
};

