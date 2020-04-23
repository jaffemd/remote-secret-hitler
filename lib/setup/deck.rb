require 'setup/constants'

module Setup
  module Deck
    include ::Setup::Constants

    def initial_shuffle
      unshuffled_deck.clone.shuffle
    end

    def draw_policies(deck, discard)
      if deck.length >= 3
        draw = deck[0, 3]
        deck = deck[3, deck.length - 3]

        if deck.length == 0
          deck = discard.clone.shuffle
          discard = []
        end

        return {
          deck: deck,
          draw: draw,
          discard: discard,
        }
      end

      cards_left = deck.length
      draw = deck[0, cards_left]
      deck = discard.clone.shuffle
      discard = []

      cards_needed = 3 - cards_left
      draw[cards_left, cards_needed] = deck[0, cards_needed]
      deck = deck[cards_needed, deck.length - cards_needed]

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
