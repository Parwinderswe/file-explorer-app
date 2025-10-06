import FileExplorer from './FileExplorer'

function MainPanel() {
  
  return (<>
    <div className='p-4 overflow-hidden border rounded-lg shadow-sm '>
        {/* <div><FolderManager/>
        </div> */}
        <div><FileExplorer /></div>
        </div>
        </>
  )
}
export default MainPanel