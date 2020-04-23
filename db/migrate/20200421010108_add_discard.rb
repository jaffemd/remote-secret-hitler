class AddDiscard < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :discard, :string, array: true, default: '{}'
  end
end
