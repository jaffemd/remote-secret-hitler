# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_26_005108) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.string "room_code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "in_progress", default: false
    t.boolean "voting", default: false
    t.string "deck", default: [], array: true
    t.string "discard", default: [], array: true
    t.string "vote_result"
    t.boolean "legislative_session", default: false
    t.string "draw", default: [], array: true
    t.integer "liberal_policies", default: 0
    t.integer "fascist_policies", default: 0
    t.integer "previous_president_id"
    t.integer "previous_chancellor_id"
    t.string "policy_played"
    t.string "active_presidential_power"
    t.string "next_presidential_power"
    t.boolean "power_in_progress", default: false
    t.integer "power_target_id"
    t.boolean "chaos_ensued", default: false
    t.integer "election_tracker", default: 0
    t.index ["room_code"], name: "index_games_on_room_code", unique: true
  end

  create_table "players", force: :cascade do |t|
    t.string "name"
    t.string "role"
    t.boolean "host"
    t.string "party"
    t.bigint "game_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "dead", default: false
    t.string "vote"
    t.boolean "president", default: false
    t.boolean "chancellor", default: false
    t.index ["game_id"], name: "index_players_on_game_id"
  end

  add_foreign_key "players", "games"
end
