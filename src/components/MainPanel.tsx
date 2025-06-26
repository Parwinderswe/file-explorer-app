import NewFolder from './NewFolder'
import FolderSelection from './FolderSelection'
import Toolbar from './Toolbar'

function MainPanel() {
  return (<>
    <div className='p-4 overflow-hidden border rounded-lg shadow-sm '>
      <div className='mb-2' >
        <Toolbar/></div>
        <div><NewFolder/></div>
      <div className=''>
        <FolderSelection/></div>
        </div>
        <div className='flex mb-4 overflow-hidden border rounded-lg shadow-sm'>
          text
        </div>
        </>
  )
}
export default MainPanel