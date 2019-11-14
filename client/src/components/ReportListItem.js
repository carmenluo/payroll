import React from "react";
export default function ReportListItem(props) {
  return <tr>
    <td>{props.employee_id}</td>
    <td>{props.pay_period}</td>
    <td>{props.amount_paid}</td>
  </tr>
}