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
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-semibold mb-4">Group Tab</h1>
        <section className="space-y-4">
          <TabList tabs={tabs} />
        </section>
      </div>
    </main>
  )
}

function TabList({ tabs }: { tabs: chrome.tabs.Tab[] }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Tab List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Tab Title</th>
              <th className="px-4 py-2">Group ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {tabs.map((tab, index) => (
              <tr key={index} className="bg-white">
                <td className="px-4 py-2 truncate w-25 max-w-md">{tab.url}</td>
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
