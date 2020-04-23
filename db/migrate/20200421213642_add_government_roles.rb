class AddGovernmentRoles < ActiveRecord::Migration[6.0]
  def change
    add_column :players, :president, :boolean, default: false
    add_column :players, :chancellor, :boolean, default: false
  end
end
