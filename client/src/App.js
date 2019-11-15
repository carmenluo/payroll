import React from 'react';
import Papa from 'papaparse';
import ReportList from './components/ReportList'
import Error from './components/Error'
import Header from './components/Header'
import SelectedFiles from './components/SelectedFiles'
import './App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedFiles: {},
      loaded: 0,
      reports: [],
      error: null,
      errorDetail: null
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this)
  }
  componentDidMount() {
    fetch('http://localhost:3001/api/records')
      .then(res => res.json())
      .then(data => {
        console.log(data.report_ids)
        let uploadedFiles = []
        data.report_ids.forEach(reportID => {
          uploadedFiles.push(reportID.report_id)
        })
        this.setState({ reports: data.reports, uploadedFiles: uploadedFiles })
      })
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded !== prevState.loaded) {
      fetch('http://localhost:3001/api/records')
        .then(res => res.json())
        .then(data => {
          let uploadedFiles = []
          data.report_ids.forEach(reportID => {
            uploadedFiles.push(reportID.report_id)
          })
          this.setState({ loaded:0, reports: data.reports, uploadedFiles: uploadedFiles })
        })
    }
  }

  duplicateReports(reportID) {
    return this.state.selectedFiles[reportID]
  }
  // pre-process report to make sure all required info exists
  preProcess(results) {
    console.log(results)
    this.setState({ error: null })
    for (let i = 1; i < results.data.length - 1; i++) {
      if (!(results.data[i][2] && results.data[i][3])) {
        this.setState({ error: "Pre Process failed: Missing employee id/job group" })
        return false;
      } else if (!results.data[results.data.length - 1][1]) {
        this.setState({ error: "Pre Process failed: Missing report id" })
        return false;
      }
    }
    return true;
  }
  onChangeHandler = event => {
    // if users click "cancel", we are not going to do anything
    if (event.target.files.length > 0) {
      let selectedFile = event.target.files[0];
      Papa.parse(event.target.files[0], {
        skipEmptyLines: true,
        complete: (results) => {
          if (this.preProcess(results)) {
            let reportID = parseInt(results.data[results.data.length - 1][1])
            if (this.state.uploadedFiles.includes(reportID)) {
              this.setState({ error: `Report id: ${reportID} is already uploaded before. Please select another file` })
            } else if (!this.duplicateReports(reportID)) {
              let selectedFiles = this.state.selectedFiles
              selectedFiles[reportID] = selectedFile
              this.setState({ selectedFiles: selectedFiles, error: null })
            } else {
              this.setState({ error: "Files with same report ID are not allowed to submit twice" })
            }
          }
        }
      })
    }
  }
  // click delete button will remove file from selectedFiles
  onDeleteHandler = (reportID) => {
    let selectedFiles = this.state.selectedFiles;
    delete selectedFiles[reportID];
    this.setState({ selectedFiles: selectedFiles })
  }
  // submit files to server and store into database
  onClickHandler = () => {
    for (let selectedFile in this.state.selectedFiles) {
      let data = new FormData()
      data.append('file', this.state.selectedFiles[selectedFile]);
      data.append('report_id', selectedFile);
      fetch('http://localhost:3001/api/records', {
        method: 'post',
        header: { 'Content-Type': 'application/json' },
        body: data
      }).then(res => {
        console.log(res)
        if (res.status !== 200) {
          this.setState({
            error: "Something went wrong when processing the data.", errorDetail: `Error Status: ${res.status} on ${res.url}
          statusText: ${res.statusText} reportID: ${selectedFile}`
          })
        } else {
          res.json()
        }
      })
        .then(data => {
          this.setState({ loaded: 1, selectedFiles: {} })
        })
    }
  }
  render() {
    let files = Object.values(this.state.selectedFiles)
    let ids = Object.keys(this.state.selectedFiles)
    let reportIDs = this.state.uploadedFiles.map((file, index) => {
      return <li className='list-inline-item' key={index}>{file}</li>
    })
    return (
      <div>
        <Header></Header>
        <div className='container'>
          <div className='row'>
            <div className='offset-md-3 col-md-6'>
              <div className='form-group files'>
                <label>Please select you file to upload</label>
                <input type='file' accept=".csv" name='file' className='form-control' onChange={this.onChangeHandler}></input>
              </div>
              <ul className='list-inline'>
                <SelectedFiles onDeleteHandler={this.onDeleteHandler} selectedFiles={files} ids={ids}></SelectedFiles>
              </ul>
              <button type='button' className='btn btn-s' onClick={this.onClickHandler}>Upload</button>
            </div>
          </div>
          <label>Payroll Report Contains the following report IDs:</label>
          <ul className='list-inline'>{reportIDs}
          </ul>

          {this.state.error && <Error error={this.state.error} errorDetail={this.state.errorDetail}></Error>}
          <ReportList reports={this.state.reports}></ReportList>
        </div>
      </div>
    )
  }
}
export default App