import {
  IAddToGroupInput,
  IDeleteTas,
  IGroupCollapseInput,
  IGroupCollapseOutput,
  IMoveTabGroup,
  IMoveTabToGroupInput,
  ITabGroup,
  ITabGroupCollapse,
  ITabGroupInput,
  ITabGroupRemoveInput,
  ITabGroupRemoveOutput,
  ITabSearchInput,
  ITabSearchOutput,
  IUpdateGroupInput,
  IUpdateTab,
} from './TabsManager.types'
export class TabsManager {
  getCurrentTabQuery = { active: true, currentWindow: true }
  getActiveTabQuery = { active: true }
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

  public async updateTab({ tab, settings }: IUpdateTab): Promise<chrome.tabs.Tab | null> {
    return new Promise((resolve) => {
      chrome.tabs.update(tab.id || 0, settings, (tab) => resolve(tab || null))
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

  public async moveTabGroup({ index, groupId }: IMoveTabGroup) {
    return new Promise((resolve) => {
      chrome.tabGroups.move(groupId, { index }, (group) => resolve(group))
    })
  }

  public async addToGroup({ tabGroupName }: IAddToGroupInput): Promise<ITabGroup> {
    const tabGroups = await this.getTabGroups({ title: tabGroupName })
    const tabs = await this.getTabs(this.getCurrentTabQuery)
    if (tabGroups.length === 0) {
      //tab group does not exist
      const groupId = await this.newGroup(tabs)
      const group = await this.updateTabGroup({ groupId, tabGroupName })
      await this.moveTabGroup({ index: 0, groupId })
      return { id: group.id, title: group.title || '' }
    } else {
      //tab group exists
      const groupId = tabGroups[0].id
      await this.moveTabsToGroup({ groupId, tabs })
      await this.moveTabGroup({ index: 0, groupId })
      return { id: groupId, title: tabGroupName }
    }
  }
  public async collapseGroup({
    groupId,
    collapsed,
  }: ITabGroupCollapse): Promise<chrome.tabGroups.TabGroup> {
    return new Promise((resolve) => {
      chrome.tabGroups.update(groupId, { collapsed: !collapsed }, (group) => resolve(group))
    })
  }
  public async toggleGroupCollapse({
    tabGroupName,
  }: IGroupCollapseInput): Promise<IGroupCollapseOutput> {
    const tabGroups = await this.getTabGroups({ title: tabGroupName })
    if (tabGroups.length === 0) {
      return { err: 'tab group does not exist', collapsed: false, groupId: -1 }
    }
    const groupId = tabGroups[0].id
    const collapsed = tabGroups[0].collapsed
    await this.collapseGroup({ groupId, collapsed })
    return { err: '', collapsed: !collapsed, groupId }
  }

  public async ungroupTabs({ tabs }: ITabGroupRemoveInput): Promise<void> {
    return new Promise((resolve) => {
      chrome.tabs.ungroup(this.getTabIds(tabs), () => resolve())
    })
  }

  public async deleteTabs({ tabs }: IDeleteTas): Promise<void> {
    return new Promise((resolve) => {
      chrome.tabs.remove(this.getTabIds(tabs), () => resolve())
    })
  }
  public async removeTabFromGroup(): Promise<ITabGroupRemoveOutput> {
    const tabs = await this.getTabs(this.getCurrentTabQuery)
    await this.ungroupTabs({ tabs })
    return { err: '', msg: 'removed tab from group' }
  }

  public givenTabGroupDeleteTabGroup = async ({ tabGroupName }: ITabGroupInput) => {
    const tabGroup = await this.getTabGroups({ title: tabGroupName })
    if (!tabGroup || tabGroup.length === 0) {
      return { err: `tab group ${tabGroupName} does not exist`, msg: '' }
    }
    const tabs = await this.getTabs({ groupId: tabGroup[0].id })
    console.log({ tabs, groupId: tabGroup[0].id, delete: true })
    await this.deleteTabs({ tabs })
    return { err: '', msg: `deleted tab group ${tabGroupName}` }
  }

  public givenTabNameSwitchToTab = async ({
    tabName,
  }: ITabSearchInput): Promise<ITabSearchOutput> => {
    const allTabs = await this.getTabs({})
    console.log({
      tabName,
      allTabs: allTabs.map((ele) => ele.title),
      allUrls: allTabs.map((ele) => ele.url),
    })
    const tab = allTabs.find((tab) => {
      return (
        tab.title?.toLowerCase().includes(tabName.toLowerCase()) ||
        tab.url?.toLowerCase().includes(tabName.toLowerCase())
      )
    })
    if (tab) {
      const currTab = await this.updateTab({ tab, settings: this.getActiveTabQuery })
      return { found: true, tab_id: tab.id || -1, title: currTab?.title || '' }
    } else {
      return { found: false, tab_id: -1, title: '' }
    }
  }
}
