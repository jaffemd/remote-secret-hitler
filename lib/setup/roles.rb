require 'setup/constants'

module Setup
  module Roles
    include ::Setup::Constants

    def randomize_roles(num_players)
      setup_map[num_players].clone.shuffle
    end

    private

    def setup_map
      {
        5 => [FASCIST_PACK, HITLER_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
        6 => [FASCIST_PACK, HITLER_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
        7 => [FASCIST_PACK, FASCIST_PACK, HITLER_PACK,
          LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
        8 => [FASCIST_PACK, FASCIST_PACK, HITLER_PACK,
          LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
        9 => [FASCIST_PACK, FASCIST_PACK, FASCIST_PACK, HITLER_PACK,
          LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
        10 => [FASCIST_PACK, FASCIST_PACK, FASCIST_PACK, HITLER_PACK,
          LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK, LIBERAL_PACK],
      }
    end
  end
end
