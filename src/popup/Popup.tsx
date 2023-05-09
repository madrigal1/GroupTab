import { KeyboardEventHandler, useEffect, useState } from 'react'
import CmdHandler from '../GroupTabHandlers/CmdHandler/CmdHandler'
import './Popup.css'

function App() {
  // const [user_input, setUserInput] = useState('')
  // const [logs, setLogs] = useState('')
  // const cmdHandler = new CmdHandler()
  let tagUI = null

  useEffect(() => {
    const tagInput = document.getElementById('tag-input') as Element
    const tagContainer = document.querySelector('.tag-container') as Element

    function createTag(text: string, command: boolean) {
      if (text === '') return
      const tag = document.createElement('span')
      tag.classList.add('tag-item')
      if (command) {
        tag.classList.add('tag-command')
      }
      tag.setAttribute('contenteditable', 'false')
      tag.innerHTML = `
    ${text.trim()}
    <button class="tag-remove ml-1">&times;</button>
  `
      tag.addEventListener('click', function (event: any) {
        if (event.target.classList.contains('tag-remove')) {
          event.target.parentNode.remove()
        }
      })
      tagContainer.insertBefore(tag, tagInput.parentNode)
      tagInput.textContent = ''
    }

    function tagInputKeyDown(event: any) {
      if (event.keyCode === 13) {
        event.preventDefault()
        const text = tagInput.textContent || ''
        const command = tagContainer.children.length <= 1
        console.log(tagContainer.children)
        createTag(text, command)
      }
    }

    tagInput.addEventListener('keydown', tagInputKeyDown)

    const tagCloseBtns = document.querySelectorAll('.tag-remove')
    tagCloseBtns.forEach((tagCloseBtn) => {
      tagCloseBtn.addEventListener('click', function (event: any) {
        if (event.target.classList.contains('tag-remove')) {
          event.target.parentNode.remove()
        }
      })
    })
  }, [])

  return (
    <main>
      <h3>GroupTabs</h3>

      <h6>v 0.0.0</h6>
      <div className="tag-container p-4 border rounded flex flex-wrap items-center">
        <div id="tag-input-wrapper" className="flex items-center">
          <div
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
