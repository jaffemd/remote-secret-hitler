class AddPresidentialPowerStuff < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :power_in_progress, :boolean, default: false
    add_column :games, :power_target_id, :integer
    add_index :games, :room_code, unique: true
  end
end
