export interface IAddToGroupInput {
  tabGroupName: string
}

export interface IUpdateGroupInput {
  groupId: number
  tabGroupName: string
}

export interface ITabGroup {
  id: number
  title: string
}

export interface IMoveTabToGroupInput {
  groupId: number
  tabs: chrome.tabs.Tab[]
}

export interface IGroupCollapseInput {
  tabGroupName: string
}

export interface IGroupCollapseOutput {
  err: string
  collapsed: boolean
  groupId: number
}

export interface ITabGroupCollapse {
  collapsed: boolean
  groupId: number
}

export interface ITabGroupRemoveOutput {
  err: string
  msg: string
}

export interface ITabGroupRemoveInput {
  tabs: chrome.tabs.Tab[]
}
export interface IMoveTabGroup {
  index: number
  groupId: number
}

export interface ITabSearchInput {
  tabName: string
}
export interface ITabSearchOutput {
  found: boolean
  tab_id: number
  title: string
}

export interface IUpdateTab {
  tab: chrome.tabs.Tab
  settings: chrome.tabs.UpdateProperties
}
