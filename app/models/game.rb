require 'setup/setup'

class Game < ApplicationRecord
  include Setup

  before_create :set_room_code
  has_many :players

  def start
    update(in_progress: true)

    deal = randomize_roles(players.length)
    players.each_with_index do |player, index|
      envelope = deal[index]
      player.update!(role: envelope[:role], party: envelope[:party])
    end

  end

  private

  def set_room_code
    self.room_code = SecureRandom.alphanumeric(5)
  end
end
