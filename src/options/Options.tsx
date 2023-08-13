import { useState, useEffect } from 'react'
import './Options.css'
import { TabsManager } from '../GroupTabHandlers/TagsManager/TabsManager'
import LogoDark from '../assets/logo_dark.png'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')

  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])
  const [grpIdMap, setGrpIdMap] = useState<Map<number, chrome.tabGroups.TabGroup>>(new Map())

  useEffect(() => {
    ;(async () => {
      const tm = new TabsManager()
      const tabs = await tm.getTabs({})
      const grpIdMap = await tm.getTabGroupMap()

      setTabs(tabs)
      setGrpIdMap(grpIdMap)
    })()
  })

  return (
    <main className="p-0">
      <header className="py-5 px-6 flex justify-center">
        <img className="max-w-[10rem]" src={LogoDark} alt="logo dark" />
      </header>
      <section>
        <TabList tabs={tabs} grpIdMap={grpIdMap} />
      </section>
    </main>
  )
}

function TabList({
  tabs,
  grpIdMap,
}: {
  tabs: chrome.tabs.Tab[]
  grpIdMap: Map<number, chrome.tabGroups.TabGroup>
}) {
  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <h1 className="text-2xl font-semibold mb-4">Tab List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2">Icon</th> {/* New column */}
              <th className="px-4 py-2">Tab Title</th>
              <th className="px-4 py-2">Tab Group</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tabs.map((tab, index) => (
              <tr key={index} className="bg-gray-900">
                <td className="px-4 py-2 w-10">
                  {tab.favIconUrl && <img src={tab.favIconUrl} alt="Favicon" className="w-6 h-6" />}
                </td>
                <td className="px-4 py-2 max-w-[0.5rem] truncate text-left">{tab.url}</td>
                <td className="px-4 py-2">{grpIdMap.get(tab.groupId)?.title || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
