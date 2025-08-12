import HeaderRow from './components/HeaderRow'
import LeftSidebar from './components/LeftSidebar'
import RightPanel from './components/RightPanel'

function App() {
  return (
    <div className="h-screen overflow-y-hidden bg-black text-white flex flex-col">
      <HeaderRow />
      <div className="flex flex-1 overflow-y-hidden h-0">
        <LeftSidebar />
        <RightPanel />
      </div>
    </div>
  )
}

export default App
