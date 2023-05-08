import { TabsManager } from '../TagsManager/TabsManager'

type stateChangeHookFunc = (arg: string) => void
export interface CmdHandlerDeps {
  setLogs: stateChangeHookFunc
}
export interface ICommand {
  cmd: string
  args: string[]
  err: string
}
export interface ICmdParserInput {
  user_input: string
}
export interface ICmdHandlerInput {
  cmd: string
  args: string[]
}
export interface ICmdHandlerOutput {
  err: string
  msg: string
}
export default class CmdHandler {
  public validCmd = ['a:']

  public tabManager = new TabsManager()

  public parseCmd = ({ user_input }: ICmdParserInput): ICommand => {
    const cmdArr = user_input
      .split(' ')
      .map((item) => item.trim())
      .filter((item) => item !== '')
    if (cmdArr.length <= 1) {
      return {
        err: 'invalid cmd: not enough args must be <cmd> <...args>',
        cmd: '',
        args: [],
      }
    }

    if (!this.validCmd.includes(cmdArr[0])) {
      return {
        err: `invalid cmd: not valid cmd.\n ValidCmds: ${this.validCmd.join(' | ')}\n but got ${
          cmdArr[0]
        }`,
        cmd: '',
        args: [],
      }
    }
    return {
      err: '',
      cmd: cmdArr[0],
      args: cmdArr.slice(1),
    }
  }

  public handleCmd = async ({ cmd, args }: ICmdHandlerInput): Promise<ICmdHandlerOutput> => {
    if (cmd === 'a:') {
      const { id, title } = await this.tabManager.addToGroup({ tabGroupName: args[0] })
      return { err: '', msg: `added group ${title} with group_id ${id}` }
    }
    return { err: `No Handler for Cmd ${cmd} found`, msg: '' }
  }
}
