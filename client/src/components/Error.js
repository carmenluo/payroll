import React from 'react'
export default function Error(props) {
  return (
    <details className='alert alert-danger'>
      <summary>{props.error}</summary>
      {props.errorDetail}
    </details>
  )
}