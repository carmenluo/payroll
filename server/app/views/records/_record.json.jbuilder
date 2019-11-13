json.extract! record, :id, :date, :hours_worked, :report_id, :employee_id, :created_at, :updated_at
json.url record_url(record, format: :json)
