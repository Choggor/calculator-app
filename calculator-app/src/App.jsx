import { useState } from 'react'
import './App.css'

const SHAPES = ['circle', 'squircle', 'diamond', 'hexagon', 'parallelogram', 'pill', 'triangle', 'star']

const BUTTON_SHAPES = (() => {
  const all = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=']
  const map = {}
  all.forEach(b => { map[b] = SHAPES[Math.floor(Math.random() * SHAPES.length)] })
  return map
})()

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

export default function App() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function handleDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  function handleDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  function handleOperator(op) {
    const current = parseFloat(display)
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, current, operator)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(current)
    }
    setOperator(op)
    setWaitingForOperand(true)
  }

  function calculate(a, b, op) {
    switch (op) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  function handleEquals() {
    if (operator === null || waitingForOperand) return
    const current = parseFloat(display)
    const result = calculate(prev, current, operator)
    setDisplay(String(result))
    setPrev(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  function handleClear() {
    setDisplay('0')
    setPrev(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  function handleToggleSign() {
    setDisplay(String(parseFloat(display) * -1))
  }

  function handlePercent() {
    setDisplay(String(parseFloat(display) / 100))
  }

  function handleButton(label) {
    if (label === 'C') return handleClear()
    if (label === '±') return handleToggleSign()
    if (label === '%') return handlePercent()
    if (label === '.') return handleDecimal()
    if (label === '=') return handleEquals()
    if (['+', '−', '×', '÷'].includes(label)) return handleOperator(label)
    handleDigit(label)
  }

  function isOperator(label) {
    return ['+', '−', '×', '÷'].includes(label)
  }

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="row">
            {row.map((label) => (
              <button
                key={label}
                className={[
                  'btn',
                  `btn-shape-${BUTTON_SHAPES[label]}`,
                  label === '0' ? 'btn-wide' : '',
                  isOperator(label) || label === '=' ? 'btn-operator' : '',
                  ['C', '±', '%'].includes(label) ? 'btn-function' : '',
                ].join(' ').trim()}
                onClick={() => handleButton(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
