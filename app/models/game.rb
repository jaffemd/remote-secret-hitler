require 'setup/roles'
require 'setup/deck'
require 'setup/presidential_powers'

class Game < ApplicationRecord
  include Setup::Roles
  include Setup::Deck
  include Setup::PresidentialPowers

  before_create :set_room_code
  has_many :players
  has_one :president, -> { president }, class_name: 'Player'
  has_one :chancellor, -> { chancellor }, class_name: 'Player'

  def full_json
    to_json(
      include: {players: { except: [:updated_at, :created_at] }},
      except: [:created_at, :updated_at],
      methods: [:last_updated]
    )
  end

  def last_updated
    ([updated_at] + players.map{ |p| p.updated_at }).max
  end

  def start
    deck = initial_shuffle
    update(
      in_progress: true,
      deck: deck,
      next_presidential_power: presidential_power(num_players, 1)
    )

    deal = randomize_roles(num_players)
    players.each_with_index do |player, index|
      envelope = deal[index]
      player.update!(role: envelope[:role], party: envelope[:party])
    end
  end

  def open_voting
    update(
      voting: true,
      vote_result: nil,
      policy_played: nil,
      active_presidential_power: nil,
      power_in_progress: false,
      power_target_id: false,
    )
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

  def enact_top_policy
    self.policy_played = deck.first
    self.deck = deck[1, deck.length - 1]
    if deck.length <= 2
      self.deck = (deck + discard).clone.shuffle
      self.discard = []
    end

    self.liberal_policies += 1 if policy_played === LIBERAL
    self.fascist_policies += 1 if policy_played === FASCIST
    self.next_presidential_power = presidential_power(num_players, fascist_policies + 1)
    self.chaos_ensued = true
    self.election_tracker = 0
    self.vote_result = nil

    save!
  end

  def start_legislative_session
    draw_result = draw_policies(deck, discard)

    update(
      vote_result: nil,
      previous_president_id: nil,
      previous_chancellor_id: nil,
      draw: draw_result[:draw],
      deck: draw_result[:deck],
      discard: draw_result[:discard],
      legislative_session: true,
      election_tracker: 0,
    )
  end

  def check_voting_finished!
    all_votes_in = players.all? { |player| player.vote || player.dead }
    if all_votes_in
      yes_votes = players.select { |player| player.vote == 'yes' }.length
      no_votes = players.select { |player| player.vote == 'no' }.length

      if yes_votes > no_votes
        failed_elections = 0
        result = 'pass'
      else
        failed_elections = election_tracker + 1
        result = 'fail'
      end

      update(
        voting: false,
        vote_result: result,
        election_tracker: failed_elections,
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

  def choose_card(selected)
    if draw.length == 3
      discarded = draw.delete_at(draw.index(selected))
      self.discard << discarded
    else
      finish_legislative_session(selected)
    end

    save!
  end

  def view_party(player_id)
    update(power_target_id: player_id, power_in_progress: false)
  end

  def execute(player_id)
    player = Player.find(player_id)
    player.update(dead: true)
    update(power_target_id: player_id, power_in_progress: false)
  end

  private

  def num_players
    players.length
  end

  def set_room_code
    self.room_code = SecureRandom.alphanumeric(5)
  end

  def finish_legislative_session(selected)
    draw.delete_at(draw.index(selected))
    self.discard += draw
    self.draw = []

    self.liberal_policies += 1 if selected === LIBERAL
    if selected === FASCIST
      self.fascist_policies += 1
      self.active_presidential_power = presidential_power(num_players, fascist_policies)
      self.power_in_progress = action_required_for_power(active_presidential_power)
      self.next_presidential_power = presidential_power(num_players, fascist_policies + 1)
    end

    self.legislative_session = false
    self.previous_president_id = president.id
    self.previous_chancellor_id = chancellor.id
    self.policy_played = selected

    players.each do |player|
      player.update(vote: nil, president: false, chancellor: false)
    end
  end
end
