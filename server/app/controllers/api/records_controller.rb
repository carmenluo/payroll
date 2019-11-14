require 'csv'
require 'date'
require 'active_support/all'
class Api::RecordsController < ApplicationController
  before_action :set_record, only: [:show, :update, :destroy]

  # GET /records
  # GET /records.json
  def index
    @records = Record.all
    render json: @records
  end

  # GET /records/1
  # GET /records/1.json
  def show
  end

  # POST /records
  # POST /records.json
  def create
    Record.destroy_all
    Employee.destroy_all
    report_id = params["report_id"].to_i
    puts params['file']
    CSV.foreach(params["file"].tempfile,headers: true, skip_blanks: true) do |row|
      # parse CSV file except for the last row
      if row[0] != "report id"
        # check if this employee id exists or not
        if !Employee.exists?(row[2])
        @employee =  Employee.create(id: row[2], job_group: row[3])
        end
        @employee = Employee.find(row[2])
        # store raw data into database with date, hours_worked, report_id and associate with Employee model
        @record = @employee.records.create(date: row[0], hours_worked: row[1], report_id: report_id )
      end
    end
    # @record = Record.new(record_params)

    # if @record.save
    #   # render :show, status: :created, location: @record
    # else
    #   render json: @record.errors, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /records/1
  # PATCH/PUT /records/1.json
  def update
    if @record.update(record_params)
      render :show, status: :ok, location: @record
    else
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  # DELETE /records/1
  # DELETE /records/1.json
  def destroy
    @record.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_record
      @record = Record.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    # def record_params
    #   params.require(:record).permit(:date, :hours_worked, :report_id, :employee_id)
    # end
end
