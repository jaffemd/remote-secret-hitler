class AddNextPresidentialPower < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :next_presidential_power, :string
  end
end
