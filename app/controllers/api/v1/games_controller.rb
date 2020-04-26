class Api::V1::GamesController < ApplicationController
  def index
    render json: Game.all
  end

  def create
    game = Game.create!
    player = nil
    if params[:name]
      player = Player.create(name: params[:name], game: game, host: true)
    end
    render json: { game: game, player: player }
  end

  def show
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)

    if !game
      render json: { error: 'Game not found', game: {} }, status: :not_found and return
    end

    if params[:last_updated]
      begin
        last_updated = DateTime.parse(params[:last_updated]).to_i

        if last_updated == game.last_updated.to_i
          render json: { up_to_date: true } and return
        end
      rescue ArgumentError
      end
    end

    render json: game.full_json
  end

  def start
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.start
    render json: game.full_json
  end

  def open_voting
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.open_voting
    render json: game.full_json
  end

  def new_election
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.new_election
    render json: game.full_json
  end

  def enact_top_policy
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.enact_top_policy
    render json: game.full_json
  end

  def legislative_session
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.start_legislative_session
    render json: game.full_json
  end

  def choose_card
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.choose_card(params[:selected])
    render json: game.full_json
  end

  def update_president
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.set_president(params[:player_id])

    render json: game.full_json
  end

  def update_chancellor
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.set_chancellor(params[:player_id])

    render json: game.full_json
  end

  def join
    game = Game.find_by(room_code: params[:room_code])
    if !game
      render json: { error: "That game code doesn't exist" } and return
    end

    host = game.players.empty?
    player = Player.create(name: params[:name], game: game, host: host)

    render json: { player: player }
  end

  def destroy
    Game.destroy(params[:id])
  end
end
