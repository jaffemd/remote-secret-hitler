class AddDeck < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :deck, :string, array: true, default: '{}'
  end
end
