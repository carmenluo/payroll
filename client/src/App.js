import React from 'react';
import logo from './logo.svg';
import papa from 'papaparse';
import './App.css';

function App() {
  return (
    <div className='container'>
        <div className='row'>
          <div className='offset-md-3 col-md-6'>
            <div className='form-group files'>
              <label>Please select you file to upload</label>
              <input type='file' accept=".csv" name='file' className='form-control' ></input>

            </div>
            <button type='button' className='btn btn-s' >Upload</button>
          </div>
        </div>
      </div>
  );
}

export default App;
