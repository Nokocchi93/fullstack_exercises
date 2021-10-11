import React, { useState } from 'react'

const Display = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistic = ({ text, value }) => {
  return (
    <tbody>
      <tr>
        <td>{text}</td><td>{value}</td>
      </tr>
    </tbody>
  )
}

const Statistics = (props) => {
  if (!props.data.good && !props.data.neutral && !props.data.bad) return <div>No feedback given</div>
  else {
    return (
      <table>
        <Statistic text="good" value={props.data.good} />
        <Statistic text="neutral" value={props.data.neutral} />
        <Statistic text="bad" value={props.data.bad} />
        <Statistic text="all" value={props.data.all} />
        <Statistic text="average" value={props.data.average} />
        <Statistic text="positive" value={props.data.positive} />
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const setToValue = (state, value) => {
    if (state === 'good') setGood(value)
    if (state === 'neutral') setNeutral(value)
    if (state === 'bad') setBad(value)
  }

  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = `${good * 100 / all} %`
  const data = {good, neutral, bad, all, average, positive}

  return (
    <div>
      <Display text="give feedback" />
      <Button handleClick={() => setToValue('good', good + 1)} text="good" />
      <Button handleClick={() => setToValue('neutral', neutral + 1)} text="neutral" />
      <Button handleClick={() => setToValue('bad', bad + 1)} text="bad" />
      <Display text="statistics" />
      <Statistics data={data} />
    </div>
  )
}

export default App
