import { TabsManager } from '../TagsManager/TabsManager'
import {
  ISaveTabGroupInput,
  ISaveTabGroupOutput,
  ISaveTagGroupsDeps,
  ISerializedTabGroup,
} from './SavedTabGroupManager.types'

export class SavedTabGroupManager {
  public tabManager: TabsManager

  constructor({ tabManager }: ISaveTagGroupsDeps) {
    this.tabManager = tabManager
  }

  public async saveToLocalStorage(obj: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => resolve(obj))
    })
  }
  public saveTabGroup = async ({
    tabGroupName,
  }: ISaveTabGroupInput): Promise<ISaveTabGroupOutput> => {
    const tabGroups = await this.tabManager.getTabGroups({ title: tabGroupName })
    if (tabGroups.length === 0) {
      return { err: `Tab group ${tabGroupName} not found`, msg: '' }
    }
    const tabs = await Promise.all(
      tabGroups.map(async (tabGroup) => {
        return await this.tabManager.getTabs({ groupId: tabGroup.id })
      }),
    )
    const tabsInfo = tabs.flat()
    const serializedTabs = tabsInfo.map((tab) => {
      return {
        url: tab.url,
        title: tab.title,
      }
    })
    console.log(serializedTabs)
    const savedObj = await this.saveToLocalStorage({ [tabGroupName]: serializedTabs })
    console.log(`Tab Group: ${tabGroupName} saved to storage: `, serializedTabs)
    return { err: '', msg: `Tab group ${tabGroupName} saved to storage` }
  }
  public async getFromLocalStorage(key: string): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (items) => resolve(items))
    })
  }
  public restoreTabGroup = async ({
    tabGroupName,
  }: ISaveTabGroupInput): Promise<ISaveTabGroupOutput> => {
    const savedObj = await this.getFromLocalStorage(tabGroupName)
    console.log(`Tab Group: ${tabGroupName} restored from storage: `, savedObj)
    const tabGroupInfo = savedObj[tabGroupName] as ISerializedTabGroup[]
    if (!tabGroupInfo || !Array.isArray(tabGroupInfo)) {
      return { err: `Tab group ${tabGroupName} not found in storage`, msg: '' }
    }
    const { err, msg } = await this.tabManager.restoreSavedTabGroup({
      tabGroupName,
      serializedTabGroup: tabGroupInfo,
    })
    return { err, msg }
  }
}
