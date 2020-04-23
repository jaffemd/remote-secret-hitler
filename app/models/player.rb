class Player < ApplicationRecord
  belongs_to :game
  scope :president, -> { where(president: true) }
  scope :chancellor, -> { where(chancellor: true) }
end
