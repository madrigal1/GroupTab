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
  public async getTabGroups(
    queryInfo: chrome.tabs.QueryInfo,
  ): Promise<chrome.tabGroups.TabGroup[]> {
    return new Promise((resolve) => {
      chrome.tabGroups.query(queryInfo, (groups) => resolve(groups))
    })
  }

  public getTabIds(tabs: chrome.tabs.Tab[]): number[] {
    return tabs.map((tab) => tab.id || -1)
  }

  public async newGroup(tabs: chrome.tabs.Tab[]): Promise<number> {
    return new Promise((resolve) => {
      chrome.tabs.group({ tabIds: this.getTabIds(tabs) }, (groupId) => resolve(groupId))
    })
  }

  public async moveTabsToGroup({ groupId, tabs }: IMoveTabToGroupInput): Promise<number> {
    return new Promise((resolve) => {
      chrome.tabs.group({ groupId, tabIds: this.getTabIds(tabs) }, (groupId) => resolve(groupId))
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
    const tabGroups = await this.getTabGroups({ title: tabGroupName })
    const tabs = await this.getTabs(this.getCurrentTabQuery)
    if (tabGroups.length === 0) {
      //tab group does not exist
      const groupId = await this.newGroup(tabs)
      const group = await this.updateTabGroup({ groupId, tabGroupName })
      return { id: group.id, title: group.title || '' }
    } else {
      //tab group exists
      const groupId = tabGroups[0].id
      await this.moveTabsToGroup({ groupId, tabs })
      return { id: groupId, title: tabGroupName }
    }
  }
}
