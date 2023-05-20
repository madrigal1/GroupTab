import { TabsManager } from '../TagsManager/TabsManager'

export interface ISaveTabGroupInput {
  tabGroupName: string
}

export interface ISaveTabGroupOutput {
  err: string
  msg: string
}

export interface ISaveTagGroupsDeps {
  tabManager: TabsManager
}

export interface ISerializedTabGroup {
  url: string
  title: string
}
