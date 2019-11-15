import React from 'react'
export default function SelectedFiles(props) {
  function deleteFile(id) {
    props.onDeleteHandler(id);
  }
  return (
    <div>
      {
        props.selectedFiles.map((file, index) =>
          <li key={index}>{file.name}
            <i className="fa fa-remove" onClick={() => deleteFile(props.ids[index])}></i>
          </li>)
      }
    </div>
  )
}