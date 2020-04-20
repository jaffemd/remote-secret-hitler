class AddVoting < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :voting, :bool, default: false
    add_column :players, :vote, :bool
  end
end
