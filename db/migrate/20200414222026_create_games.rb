class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :hashed_id

      t.timestamps
    end
  end
end
