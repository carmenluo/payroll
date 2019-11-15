class AddDefaulsValueToRecord < ActiveRecord::Migration[5.2]
  def change
    change_column :records, :hours_worked, :decimal, default: 0
  end
end