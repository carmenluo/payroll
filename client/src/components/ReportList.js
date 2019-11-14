import React from 'react';
import ReactDOM from 'react-dom'
import ReportListItem from './ReportListItem';
const ReportList = (props) => {
  if (Array.isArray(props.reports)) {
    let reports = props.reports.map((report, index) => {
      //   return <RowItem key={employee.id} id={employee.id} job_group={employee.job_group} />
      // }));
      let pay_period =`${report.pay_start_date} - ${report.pay_end_date}`
      return <ReportListItem key={index} employee_id={report.employee_id} pay_period={pay_period} amount_paid={report.amount_paid} />
    });
    return <table className='table'>
      <thead>
        <tr>
          <th>Employees ID</th>
          <th>Pay Period</th>
          <th>Amount Paid</th>
        </tr>
      </thead>
      <tbody>{reports}</tbody>
    </table>

  } else {
    return <div></div>
  }
}

export default ReportList;