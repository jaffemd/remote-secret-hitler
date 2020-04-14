class Game < ApplicationRecord
  before_create :set_hashed_id

  private

  def set_hashed_id
    self.hashed_id = SecureRandom.alphanumeric(10)
  end
end
