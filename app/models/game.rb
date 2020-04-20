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

  def open_voting
    update(voting: true)
    players.each do |player|
      player.update(vote: nil)
    end
  end

  def check_voting_finished!
    all_votes_in = players.all? { |player| player.vote }
    update(voting: false) if all_votes_in
  end

  private

  def set_room_code
    self.room_code = SecureRandom.alphanumeric(5)
  end
end
