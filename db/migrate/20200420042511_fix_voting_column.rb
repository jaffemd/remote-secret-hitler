class FixVotingColumn < ActiveRecord::Migration[6.0]
  def change
    change_column :players, :vote, :string
  end
end
