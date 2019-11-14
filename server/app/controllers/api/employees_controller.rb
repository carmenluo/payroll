class Api::EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  # GET /employees.json
  def index
    @employees = Employee.all
    render json: @employees
  end

  # GET /employees/1
  # GET /employees/1.json
  def show
  end

  # POST /employees
  # POST /employees.json
  def create
    @employee = Employee.new(employee_params)

    if @employee.save
      render :show, status: :created, location: @employee
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    if @employee.update(employee_params)
      render :show, status: :ok, location: @employee
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_employee
      @employee = Employee.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def employee_params
      params.require(:employee).permit(:job_group)
    end
end
