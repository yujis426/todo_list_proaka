import { useState } from 'react'

interface UseCounterProps {
  initialValue?: number
  min?: number
  max?: number
}

export function useCounter({ 
  initialValue = 0, 
  min = -Infinity, 
  max = Infinity 
}: UseCounterProps = {}) {
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    setCount(prev => prev < max ? prev + 1 : prev)
  }

  const decrement = () => {
    setCount(prev => prev > min ? prev - 1 : prev)
  }

  const reset = () => {
    setCount(initialValue)
  }

  return {
    count,
    increment,
    decrement,
    reset,
    isMinValue: count === min,
    isMaxValue: count === max
  }
}
