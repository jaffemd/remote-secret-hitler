class ChangeGameIdColumnName < ActiveRecord::Migration[6.0]
  def change
    rename_column :games, :hashed_id, :room_code
  end
end
