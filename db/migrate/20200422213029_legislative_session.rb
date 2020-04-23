class LegislativeSession < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :legislative_session, :boolean, default: false
    add_column :games, :draw, :string, array: true, default: '{}'
  end
end
