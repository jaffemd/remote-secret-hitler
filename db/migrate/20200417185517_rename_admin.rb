class RenameAdmin < ActiveRecord::Migration[6.0]
  def change
    rename_column :players, :admin, :host
  end
end
