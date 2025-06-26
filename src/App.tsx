
import './App.css'
import MainPanel from './components/MainPanel'
import QuickAccess from './components/QuickAccess'

function App() {
  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] h-screen ">
        <div><QuickAccess/></div>
        <div className='p-4 '> <MainPanel/></div>
   
    </div>
   
    </>
  )
}

export default App
