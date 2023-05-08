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

export interface IMinArgsInput {
  args: string[]
  minArgs: number
}
export default class CmdHandler {
  public validCmd = ['a:', 'c:', 'r:']

  public tabManager = new TabsManager()

  public parseCmd = ({ user_input }: ICmdParserInput): ICommand => {
    const cmdArr = user_input
      .split(' ')
      .map((item) => item.trim())
      .filter((item) => item !== '')

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

  public checkMinArgsErr = ({ args, minArgs }: IMinArgsInput): ICmdHandlerOutput => {
    if (args.length < minArgs) {
      return {
        err: `invalid cmd: must have at least ${minArgs} args. Format: <cmd> <...args>`,
        msg: '',
      }
    } else {
      return {
        err: '',
        msg: '',
      }
    }
  }
  public handleCmd = async ({ cmd, args }: ICmdHandlerInput): Promise<ICmdHandlerOutput> => {
    if (cmd !== 'r:') {
      const check = this.checkMinArgsErr({ args, minArgs: 1 })
      if (check.err !== '') return check
    }
    if (cmd === 'a:') {
      const { id, title } = await this.tabManager.addToGroup({ tabGroupName: args[0] })
      return { err: '', msg: `added group ${title} with group_id ${id}` }
    }
    if (cmd === 'c:') {
      const { err, collapsed, groupId } = await this.tabManager.toggleGroupCollapse({
        tabGroupName: args[0],
      })
      return { err, msg: `toggled group ${groupId} to collapsed state: ${collapsed}` }
    }

    if (cmd === 'r:') {
      await this.tabManager.removeTabFromGroup()
      return { err: '', msg: `removed tab from group` }
    }
    return { err: `No Handler for Cmd ${cmd} found`, msg: '' }
  }
}
