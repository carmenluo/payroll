import React from 'react';
import Papa from 'papaparse';
import './App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      selectedFiles: {},
      loaded: 0,
      records: [],
      error: null
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  componentDidMount() {
    fetch('http://localhost:3001/api/records')
      .then(res=>res.json())
      .then(data=>console.log(data))
  }
  // if reportID exists in selectedFiles, return true
  duplicateReports(reportID) {
    return this.state.selectedFiles[reportID]
  }
  onChangeHandler = event => {
    let selectedFile = event.target.files[0];
   // console.log(Object.values(this.state.selectedFiles))
    Papa.parse(event.target.files[0], {
      skipEmptyLines: true,
      complete: (results) => {
        let reportID = parseInt(results.data[results.data.length - 1][1])
        console.log(this.duplicateReports(reportID))
        if (!this.duplicateReports(reportID)) {
          let selectedFiles = this.state.selectedFiles
          selectedFiles[reportID] = selectedFile
          this.setState({ selectedFiles: selectedFiles, error: null })
        } else {
          this.setState({ error: "Files with same report ID are not allowed to submit twice" })
        }
      }
    })
  }
  // submit files to server and store into database
  onClickHandler = () => {
    for (let selectedFile in this.state.selectedFiles) {
    let data = new FormData()
    data.append('file', this.state.selectedFiles[selectedFile]);
    data.append('report_id', selectedFile);
    fetch('http://localhost:3001/api/records', {
      method: 'post',
      header: {'Content-Type': 'application/json'},
      body:data
    }).then(res => {
      console.log(res)
    }).catch(err => console.log(err))
  }
}
  render() {
    // console.log(Object.values(this.state.selectedFiles))
    let files = Object.values(this.state.selectedFiles).map((file,index)=> {
      return <li key={index}>{file.name}</li>
    })
    return (
      <div className='container'>
        <div className='row'>
          <div className='offset-md-3 col-md-6'>
            <div className='form-group files'>
              <label>Please select you file to upload</label>
              <input type='file' accept=".csv" name='file' className='form-control' onChange={this.onChangeHandler}></input>
            </div>
            <ul className='list-inline'>
              {files}
            </ul>
            <button type='button' className='btn btn-s' onClick={this.onClickHandler}>Upload</button>
          </div>
        </div>
        {this.state.error &&
          <div className='alert alert-danger'>{this.state.error}</div>}
      </div>
    )
  }
}
export default App