import { useState, useEffect } from 'react'
import './Options.css'
import { TabsManager } from '../GroupTabHandlers/TagsManager/TabsManager'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')

  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])

  useEffect(() => {
    ;(async () => {
      const tm = new TabsManager()
      const tabs = await tm.getTabs({})
      setTabs(tabs)
    })()
  })

  return (
    <main>
      <h1 className="text-xl font-semibold mb-4">Group Tab</h1>
      <section className="space-y-4">
        <TabList tabs={tabs} />
      </section>
    </main>
  )
}

function TabList({ tabs }: { tabs: chrome.tabs.Tab[] }) {
  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-semibold mb-4">Tab List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2">Icon</th> {/* New column */}
              <th className="px-4 py-2">Tab Title</th>
              <th className="px-4 py-2">Group ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tabs.map((tab, index) => (
              <tr key={index} className="bg-gray-900">
                <td className="px-4 py-2 w-10">
                  {tab.favIconUrl && <img src={tab.favIconUrl} alt="Favicon" className="w-6 h-6" />}
                </td>
                <td className="px-4 py-2 max-w-[0.5rem] truncate text-left">{tab.url}</td>
                <td className="px-4 py-2">{tab.groupId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
