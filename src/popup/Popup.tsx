import { useEffect, useRef } from 'react'
import { TagUI } from '../GroupTabHandlers/TagUIManger/tag_ui'
import './Popup.css'
import Menu1 from '../assets/menu_1.png'
import GearIcon from '../assets/gear_img.png'

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
    <main className="p-2">
      <header className="flex justify-between item-center">
        <h2 className="text-black font-medium text-lg">GroupTabs</h2>
        <h6 className="text-gray-400 font-medium text-custom-md mr-2">v1.0.0</h6>
      </header>
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
      <footer className="flex justify-between items-center mt-4 mx-1">
        <div className="flex items-center">
          <img className="object-contain mr-2 sm-img" src={Menu1} alt="save button" />
          <p className="font-semibold">Saves</p>
        </div>
        <div>
          <img src={GearIcon} alt="gear icon" className="md-img" />
        </div>
      </footer>
    </main>
  )
}

export default App
