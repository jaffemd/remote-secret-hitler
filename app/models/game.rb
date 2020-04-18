class Game < ApplicationRecord
  before_create :set_room_code
  has_many :players

  private

  def set_room_code
    self.room_code = SecureRandom.alphanumeric(5)
  end
end
