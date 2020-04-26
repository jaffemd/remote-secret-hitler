class PreviousGovernment < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :previous_president_id, :integer
    add_column :games, :previous_chancellor_id, :integer
    add_column :games, :policy_played, :string
    add_column :games, :active_presidential_power, :string
  end
end
