class AddVoteResult < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :vote_result, :string
  end
end
