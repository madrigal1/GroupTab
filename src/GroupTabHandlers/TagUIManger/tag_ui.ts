import CmdHandler from '../CmdHandler/CmdHandler'

export class TagUI {
  public tagInput: Element
  public tagContainer: Element
  public cmdHandler = new CmdHandler()
  public currentCmd: string[] = []
  constructor() {
    this.tagInput = document.getElementById('tag-input') as Element
    this.tagContainer = document.querySelector('.tag-container') as Element

    this.tagInput.addEventListener('keydown', this.tagInputKeyDown)

    const tagCloseBtns = document.querySelectorAll('.tag-remove')
    tagCloseBtns.forEach((tagCloseBtn) => {
      tagCloseBtn.addEventListener('click', (event: any) => {
        if (event.target.classList.contains('tag-remove')) {
          event.target.parentNode.remove()
          this.currentCmd.pop()
        }
      })
    })
  }
  public createTag = (text: string, command: boolean) => {
    if (text === '') return
    const tag = document.createElement('span')
    tag.classList.add('tag-item')
    if (command) {
      tag.classList.add('tag-command')
    }
    tag.setAttribute('contenteditable', 'false')
    const txtVal = text.trim()
    tag.innerHTML = `
      ${txtVal}
      <button class="tag-remove ml-1">&times;</button>
    `
    this.currentCmd.push(txtVal)
    tag.addEventListener('click', (event: any) => {
      if (event.target.classList.contains('tag-remove')) {
        event.target.parentNode.remove()
        this.currentCmd.pop()
      }
    })
    this.tagContainer.insertBefore(tag, this.tagInput?.parentNode)
    this.tagInput.textContent = ''
  }

  public tagInputKeyDown = async (event: any) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      //on press space or enter
      event.preventDefault()
      const text = this.tagInput?.textContent || ''
      const command = this.cmdHandler.isValidCmd(text)
      if (command) {
        this.currentCmd = []
        // this.tagContainer.querySelectorAll('span').forEach((span) => span.remove());
      }
      this.createTag(text, command)
      if (this.currentCmd.length == 0) {
        // console.log("skip empty cmd");
        return
      }
      console.log({ user_input: this.currentCmd })
      const cmdReport = this.cmdHandler.parseCmd({ user_input: this.currentCmd })
      console.log(JSON.stringify(cmdReport))
      console.log(`cmd is valid: ${cmdReport.cmd}`)
      const { err, msg } = await this.cmdHandler.handleCmd({
        cmd: cmdReport.cmd,
        args: cmdReport.args,
      })
      console.log(JSON.stringify({ err, msg }))
    }

    if (event.keyCode === 8) {
      //on press backspace
      if (this.tagInput.textContent == '') {
        const lastSpan = Array.from(this.tagContainer.children)
          .filter((child) => child.tagName === 'SPAN')
          .pop()
        console.log(lastSpan)
        if (lastSpan) {
          lastSpan.remove()
          this.currentCmd = []
          this.currentCmd.length = 0
        }
      }
    }
  }
}
