class Migration < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :chaos_ensued, :boolean, default: false
  end
end
