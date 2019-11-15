require 'csv'
require 'date'
require 'active_support/all'
class Api::RecordsController < ApplicationController
  # before_action :set_record, only: [:show, :update, :destroy]

  # GET /records
  # GET /records.json
  def index
    reports =  Report.order('employee_id, pay_start_date').all
    report_ids = Record.select(:report_id).distinct
    render json: {reports: reports, report_ids: report_ids}
  end

  # shows records corresponding to reports
  def show
    report_id = params[:id]
    render json: Record.where(report_id: report_id)
  end

  def create
    Report.destroy_all
    Record.destroy_all
    Employee.destroy_all
    report_id = params["report_id"].to_i
    CSV.foreach(params["file"].tempfile,headers: true, skip_blanks: true) do |row|
      # parse CSV file except for the last row
      if row[0] != "report id"
        # check if this employee id exists or not
        if !Employee.exists?(row[2])
        @employee =  Employee.create!(id: row[2], job_group: row[3])
        end
        @employee = Employee.find(row[2])
        # store raw data into database with date, hours_worked, report_id and associate with Employee model
        @record = @employee.records.new(date: row[0], hours_worked: row[1] || 0, report_id: report_id )
        if @record.save
          add_report_item(@employee, @record)
        else
          render json: {error: @record.errors,report_id: report_id}
        end       
      end
    end
    reports =  Report.order('employee_id, pay_start_date').all
    report_ids = Record.select(:report_id).distinct
    render json: {reports: reports, report_ids: report_ids}
  end
  # Based on records calculate report items and store into database
  def add_report_item(employee, record)
    if record.hours_worked != 0 
    amount_paid = 0
    case employee.job_group
    when "A"
      amount_paid += record.hours_worked * 30
    when "B"
      amount_paid += record.hours_worked * 20
    end
    current_date = record.date
    case current_date.day
    when 1..15
      pay_start_date = current_date.beginning_of_month
      pay_end_date = Date.new(current_date.year, current_date.month, 15)
    when 16..31
      pay_start_date = Date.new(current_date.year, current_date.month, 16)
      pay_end_date = current_date.end_of_month 
    end
    report = Report.where(employee_id: employee.id, pay_start_date:  pay_start_date, pay_end_date: pay_end_date).first_or_create
    report.amount_paid ||= 0
    report.amount_paid += amount_paid
    report.save!
  end
  end
 
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_record
      @record = Record.find(params[:id])
    end

end
