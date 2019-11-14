class CreateReports < ActiveRecord::Migration[5.2]
  def change
    create_table :reports do |t|
      t.date :pay_start_date
      t.date :pay_end_date
      t.decimal :amount_paid
      t.references :employee, foreign_key: true

      t.timestamps
    end
  end
end
