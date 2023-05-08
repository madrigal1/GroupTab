import { useEffect, useState } from 'react'
import './Popup.css'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')
  const [cmd, setCmd] = useState('')

  useEffect(()=> {
  },[])

  return (
    <main>
      <h3>Popup Page!</h3>

      <h6>v 0.0.0</h6>
      {/* <p>No tab Group {output}</p> */}
      <input type="text" className="border rounded py-2 px-3" value={cmd} onChange={(e)=>setCmd(e.target.value)}/>
    </main>
  )
}

export default App
