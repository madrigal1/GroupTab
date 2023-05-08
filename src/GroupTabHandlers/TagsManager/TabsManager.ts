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
export class TabsManager {
  getCurrentTabQuery = { active: true, currentWindow: true }

  public async checkTabGroupExists({ tabGroupName }: IAddToGroupInput): Promise<boolean> {
    const groups: any = await new Promise((resolve) => {
      chrome.tabGroups.query({ title: tabGroupName }, (groups) => {
        resolve(groups)
      })
    })

    return groups.length > 0
  }

  public async getTabs(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query(queryInfo, (tabs) => resolve(tabs))
    })
  }
  public async groupTabs(tabs: chrome.tabs.Tab[]): Promise<number> {
    return new Promise((resolve) => {
      chrome.tabs.group({ tabIds: tabs.map((tab) => tab.id || -1) }, (groupId) => resolve(groupId))
    })
  }

  public async updateTabGroup({
    groupId,
    tabGroupName,
  }: IUpdateGroupInput): Promise<chrome.tabGroups.TabGroup> {
    return new Promise((resolve) => {
      chrome.tabGroups.update(groupId, { title: tabGroupName }, (group) => resolve(group))
    })
  }
  public async addToGroup({ tabGroupName }: IAddToGroupInput): Promise<ITabGroup> {
    const tabs = await this.getTabs(this.getCurrentTabQuery)
    const groupId = await this.groupTabs(tabs)
    const group = await this.updateTabGroup({ groupId, tabGroupName })
    return { id: group.id, title: group.title || '' }
  }
}
