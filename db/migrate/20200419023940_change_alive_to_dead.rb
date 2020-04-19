class ChangeAliveToDead < ActiveRecord::Migration[6.0]
  def change
    remove_column :players, :alive
    add_column :players, :dead, :boolean, default: false
  end
end
