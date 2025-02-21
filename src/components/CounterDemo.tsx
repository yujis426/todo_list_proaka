import React from 'react';
import { useCounter } from '../hooks/useCounter';

const CounterDemo = () => {
 const { count, increment, decrement, reset } = useCounter({
  initialValue: 0,
  min: 0,
  max: 10,
 });

 return (
  <div>
   <h2>カウンターデモ</h2>
   <p>現在のカウント: {count}</p>
   <button onClick={decrement}>-1 減らす</button>
   <button onClick={increment}>+1 増やす</button>
   <button onClick={reset}>リセット</button>
  </div>
 );
};

export default CounterDemo;