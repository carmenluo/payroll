class Employee < ApplicationRecord
  has_many :records
  validates :job_group, presence: true
end
