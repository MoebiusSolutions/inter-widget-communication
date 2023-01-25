import React, { useState, useEffect } from 'react';
import './App.css';
import { subscribe, publish } from '@moesol/inter-widget-communication';

interface AppProps {}

function App({}: AppProps) {
  // Create the count state.
  const [count, setCount] = useState(0);
  const [lastFive, setLastFive] = useState<string[]>([])

  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000);
    return () => clearTimeout(timer);
  }, [count, setCount]);

  React.useEffect(() => {
    subscribe('test.test', (sender: string, msg: string) => {
      console.log('sender:', sender, 'msg: ', msg)
      setLastFive(a => [msg, ...a].slice(0, 5))
    })
  }, [])

  const inputRef = React.useRef<HTMLInputElement>() as any

  function handleSend(evt: React.FormEvent) {
    evt.preventDefault()

    const input = inputRef.current as HTMLInputElement
    publish('test.test', input.value)
    input.value = ''
  }

  // Return the App component.
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form onSubmit={handleSend}>
            <input ref={inputRef} ></input>
            <button onClick={handleSend}>Send</button>
          </form>
          {lastFive.map((msg, idx) => <p key={idx}>{msg}</p>)}
        </div>
      </header>
    </div>
  );
}

export default App;
