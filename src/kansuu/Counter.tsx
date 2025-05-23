import { useState } from 'react';

export default function Counter() {
  const [score, setscore] = useState(0);

  function increment() {
    setscore(a => a + 1);
  }

  function decrement() {
    setscore(a => (a > 0 ? a - 1 : a)); // 0未満にならないように条件を追加
  }

  return (
    <>
      {score}
      <button onClick={() => {
        decrement();
      }}>-1</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
