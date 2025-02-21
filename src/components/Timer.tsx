import { useState, useEffect } from 'react'

function Timer() {
  // 現在時刻を管理するState
  const [time, setTime] = useState<string>('')

  // コンポーネントがマウントされたときに実行
  useEffect(() => {
    // 1秒ごとに時刻を更新
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString())
    }, 1000)

    // クリーンアップ関数（アンマウント時に実行）
    return () => {
      clearInterval(timer)
    }
  }, []) // 空の依存配列を指定

  return (
    <div className="timer">
      <h2>現在時刻</h2>
      <p>{time}</p>
    </div>
  )
}

export default Timer