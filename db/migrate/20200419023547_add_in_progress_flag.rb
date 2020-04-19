class AddInProgressFlag < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :in_progress, :boolean, default: false
  end
end
