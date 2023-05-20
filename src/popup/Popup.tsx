import { useEffect, useRef } from 'react'
import { TagUI } from '../GroupTabHandlers/TagUIManger/tag_ui'
import './Popup.css'

function App() {
  // const [user_input, setUserInput] = useState('')
  // const [logs, setLogs] = useState('')
  // const cmdHandler = new CmdHandler()
  let tagUI = null
  const tagInput = useRef<HTMLDivElement>(null)

  const focusInput = () => {
    let p = tagInput.current
    console.log(p)
    if (p) {
      setTimeout(function () {
        p?.focus()
      }, 0)
    }
  }

  useEffect(() => {
    tagUI = new TagUI()
    focusInput()
  })

  return (
    <main>
      <h3>GroupTabs</h3>

      <h6>v 0.0.0</h6>
      <div className="tag-container p-4 border rounded flex flex-wrap items-center">
        <div id="tag-input-wrapper" className="flex items-center">
          <div
            ref={tagInput}
            id="tag-input"
            contentEditable="true"
            className="border border-gray-300 rounded outline-none text-sm px-2 py-1"
          ></div>
        </div>
      </div>
    </main>
  )
}

export default App
