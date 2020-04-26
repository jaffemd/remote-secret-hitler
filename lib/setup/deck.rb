require 'setup/constants'

module Setup
  module Deck
    include ::Setup::Constants

    def initial_shuffle
      unshuffled_deck.clone.shuffle
    end

    def draw_policies(deck, discard)
      if deck.length <= 2
        deck = (deck + discard).clone.shuffle
        discard = []
      end

      draw = deck[0, 3]
      deck = deck[3, deck.length - 3]

      if deck.length <= 2
        deck = (deck + discard).clone.shuffle
        discard = []
      end

      return {
        deck: deck,
        draw: draw,
        discard: discard,
      }
    end

    private

    def unshuffled_deck
      Array.new(6, LIBERAL) + Array.new(11, FASCIST)
    end
  end
end
