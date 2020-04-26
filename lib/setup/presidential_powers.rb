module Setup
  module PresidentialPowers
    INVESTIGATE = 'INVESTIGATE'
    SPECIAL_ELECTION = 'SPECIAL_ELECTION'
    PEEK = 'PEEK'
    EXECUTION = 'EXECUTION'

    def presidential_power(num_players, fascist_policies)
      if num_players <= 6
        powers = [nil, nil, nil, PEEK, EXECUTION, EXECUTION, nil]
      elsif num_players <= 8
        powers = [nil, nil, INVESTIGATE, SPECIAL_ELECTION, EXECUTION, EXECUTION, nil]
      else
        powers = [nil, INVESTIGATE, INVESTIGATE, SPECIAL_ELECTION, EXECUTION, EXECUTION, nil]
      end

      return powers[fascist_policies]
    end

    def action_required_for_power(power)
      [INVESTIGATE, EXECUTION].include?(power)
    end
  end
end
