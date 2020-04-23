class Api::V1::GamesController < ApplicationController
  def index
    render json: Game.all
  end

  def create
    game = Game.create
    player = nil
    if params[:name]
      player = Player.create(name: params[:name], game: game, host: true)
    end
    render json: { game: game, player: player }
  end

  def show
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    render json: game.to_json(include: :players)
  end

  def start
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.start
    render json: game.to_json(include: :players)
  end

  def open_voting
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.open_voting
    render json: game.to_json(include: :players)
  end

  def new_election
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.new_election
    render json: game.to_json(include: :players)
  end

  def legislative_session
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.start_legislative_session
    render json: game.to_json(include: :players)
  end

  def choose_card
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.choose_card(params[:card_index])
    render json: game.to_json(include: :players)
  end

  def update_president
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.set_president(params[:player_id])

    render json: game.to_json(include: :players)
  end

  def update_chancellor
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    game.set_chancellor(params[:player_id])

    render json: game.to_json(include: :players)
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
