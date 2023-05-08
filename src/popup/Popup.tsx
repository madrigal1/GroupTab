import { KeyboardEventHandler, useEffect, useState } from 'react'
import CmdHandler from '../GroupTabHandlers/CmdHandler/CmdHandler'
import './Popup.css'

function App() {
  const [user_input, setUserInput] = useState('')
  const [logs, setLogs] = useState('')
  const cmdHandler = new CmdHandler()

  useEffect(() => {}, [])

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key was pressed')
      const { err: parserErr, cmd, args } = cmdHandler.parseCmd({ user_input })
      if (parserErr !== '') {
        setLogs(parserErr)
        return
      }
      setLogs(JSON.stringify({ cmd, args }))
      const { msg, err: handlerErr } = await cmdHandler.handleCmd({ cmd, args })
      if (handlerErr !== '') {
        setLogs(handlerErr)
        return
      }
      setLogs(msg)
      // Perform any additional actions here, such as submitting the form
    }
  }

  return (
    <main>
      <h3>Popup Page!</h3>

      <h6>v 0.0.0</h6>
      {/* <p>No tab Group {output}</p> */}
      <input
        type="text"
        className="border rounded py-2 px-3"
        value={user_input}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p>{logs}</p>
    </main>
  )
}

export default App
