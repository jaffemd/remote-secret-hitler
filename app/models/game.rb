require 'setup/roles'
require 'setup/deck'

class Game < ApplicationRecord
  include Setup::Roles
  include Setup::Deck

  before_create :set_room_code
  has_many :players
  has_one :president, -> { president }, class_name: 'Player'
  has_one :chancellor, -> { chancellor }, class_name: 'Player'

  def start
    deck = initial_shuffle
    update(in_progress: true, deck: deck)

    deal = randomize_roles(players.length)
    players.each_with_index do |player, index|
      envelope = deal[index]
      player.update!(role: envelope[:role], party: envelope[:party])
    end
  end

  def open_voting
    update(voting: true, vote_result: nil)
    players.each do |player|
      player.update(vote: nil)
    end
  end

  def new_election
    update(voting: false, vote_result: nil)
    players.each do |player|
      player.update(vote: nil, president: false, chancellor: false)
    end
  end

  def start_legislative_session
    draw_result = draw_policies(deck, discard)

    update(
      vote_result: nil,
      draw: draw_result[:draw],
      deck: draw_result[:deck],
      discard: draw_result[:discard],
      legislative_session: true,
    )
  end

  def check_voting_finished!
    all_votes_in = players.all? { |player| player.vote }
    if all_votes_in
      yes_votes = players.select { |player| player.vote == 'yes' }.length
      no_votes = players.select { |player| player.vote == 'no' }.length

      update(
        voting: false,
        vote_result: yes_votes > no_votes ? 'pass' : 'fail'
      )
    end
  end

  def set_president(player_id)
    players.each do |player|
      is_president = player.id == player_id
      player.update(president: is_president)
    end
  end

  def set_chancellor(player_id)
    players.each do |player|
      is_chancellor = player.id == player_id
      player.update(chancellor: is_chancellor)
    end
  end

  def choose_card(card_index)
    if draw.length == 3
      discarded = draw.delete_at(card_index)
      self.discard << discarded
    else
      selected = draw.delete_at(card_index)
      self.discard += draw
      self.liberal_policies += 1 if selected === LIBERAL
      self.fascist_policies += 1 if selected === FASCIST
      self.draw = []
      self.legislative_session = false

      players.each do |player|
        player.update(vote: nil)
      end
    end
    save!
  end

  private

  def set_room_code
    self.room_code = SecureRandom.alphanumeric(5)
  end
end
