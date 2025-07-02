import FolderSelection from './FolderSelection'
import FolderManager from './FolderManager'

function MainPanel() {
  return (<>
    <div className='p-4 overflow-hidden border rounded-lg shadow-sm '>
        <div><FolderManager/></div>
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