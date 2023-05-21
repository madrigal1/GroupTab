import { SavedTabGroupManager } from '../SavedTabGroupsManager/SavedTabGroupManager'
import { TabsManager } from '../TagsManager/TabsManager'
import {
  ICmdHandlerInput,
  ICmdHandlerOutput,
  ICmdParserInput,
  ICommand,
  IMinArgsInput,
} from './CmdHandler.types'

export enum Cmd {
  ADD = 'add',
  TOGGLE = 'toggle',
  REMOVE = 'remove',
  SEARCH = 'search',
  KILL = 'kill',
  SAVE = 'save',
  RESTORE = 'restore',
  COLLAPSE_ALL = 'collapse-all',
}

export interface ICmd {
  alias: string[]
  name: string
}

export default class CmdHandler {
  public cmds: ICmd[] = [
    {
      name: Cmd.ADD,
      alias: ['add', 'a'],
    },
    {
      name: Cmd.TOGGLE,
      alias: ['toggle', 't'],
    },
    {
      name: Cmd.REMOVE,
      alias: ['remove', 'rm'],
    },
    {
      name: Cmd.SEARCH,
      alias: ['search', 'sr'],
    },
    {
      name: Cmd.KILL,
      alias: ['kill', 'k'],
    },
    {
      name: Cmd.SAVE,
      alias: ['save', 'sv'],
    },
    {
      name: Cmd.RESTORE,
      alias: ['restore', 'rs', 'rt'],
    },
    {
      name: Cmd.COLLAPSE_ALL,
      alias: ['collapse-all', 'c'],
    },
  ]
  public tabManager = new TabsManager()
  public savedTabGroupManager = new SavedTabGroupManager({ tabManager: this.tabManager })

  public isValidCmd = (cmd: string): boolean => {
    return this.cmds.some((cmdObj) => cmdObj.alias.includes(cmd))
  }
  public parseCmd = ({ user_input }: ICmdParserInput): ICommand => {
    const cmdArr = user_input.map((item) => item.trim()).filter((item) => item !== '')

    const cmd = this.cmds.find((cmd) => cmd.alias.includes(cmdArr[0]))
    if (!cmd) {
      return {
        err: `invalid cmd: not valid cmd.\n ValidCmds: ${this.cmds
          .map((ele) => ele.alias)
          .flat()
          .join(' | ')}\n but got ${cmdArr[0]}`,
        cmd: '',
        args: [],
      }
    }
    return {
      err: '',
      cmd: cmd.name,
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
    const noArgsCmds: string[] = [Cmd.COLLAPSE_ALL, Cmd.REMOVE]
    if (!noArgsCmds.includes(cmd)) {
      const check = this.checkMinArgsErr({ args, minArgs: 1 })
      if (check.err !== '') return check
    }
    if (cmd === Cmd.ADD) {
      const { id, title } = await this.tabManager.addToGroup({ tabGroupName: args[0] })
      return { err: '', msg: `added group ${title} with group_id ${id}` }
    }
    if (cmd === Cmd.TOGGLE) {
      const { err, collapsed, groupId } = await this.tabManager.toggleGroupCollapse({
        tabGroupName: args[0],
      })
      return { err, msg: `toggled group ${groupId} to collapsed state: ${collapsed}` }
    }

    if (cmd === Cmd.REMOVE) {
      await this.tabManager.removeTabFromGroup()
      return { err: '', msg: `removed tab from group` }
    }

    if (cmd === Cmd.SEARCH) {
      const { found, tab_id, title } = await this.tabManager.givenTabNameSwitchToTab({
        tabName: args[0],
      })
      return {
        err: found ? `Tab not found` : '',
        msg: found
          ? `Tab ${title} found and switched to. Tab_id: ${tab_id}`
          : `Tab ${title} not found`,
      }
    }

    if (cmd === Cmd.KILL) {
      const { err, msg } = await this.tabManager.givenTabGroupDeleteTabGroup({
        tabGroupName: args[0],
      })
      return { err, msg }
    }

    if (cmd === Cmd.SAVE) {
      const { err, msg } = await this.savedTabGroupManager.saveTabGroup({ tabGroupName: args[0] })
      return { err, msg }
    }

    if (cmd === Cmd.RESTORE) {
      const { err, msg } = await this.savedTabGroupManager.restoreTabGroup({
        tabGroupName: args[0],
      })
      return { err, msg }
    }

    if (cmd === Cmd.COLLAPSE_ALL) {
      await this.tabManager.collapseAllTabGroups()
      return { err: '', msg: 'collapsed all tab groups' }
    }
    return { err: `No Handler for Cmd ${cmd} found`, msg: '' }
  }
}
