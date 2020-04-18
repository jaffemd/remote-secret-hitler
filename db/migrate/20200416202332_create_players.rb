class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.string :role
      t.boolean :alive
      t.boolean :admin
      t.string :party
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
