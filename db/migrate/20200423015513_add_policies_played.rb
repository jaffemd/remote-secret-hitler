class AddPoliciesPlayed < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :liberal_policies, :integer, default: 0
    add_column :games, :fascist_policies, :integer, default: 0
  end
end
