class AddElectionTracker < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :election_tracker, :integer, default: 0
  end
end
