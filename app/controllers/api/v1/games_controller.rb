class Api::V1::GamesController < ApplicationController
  def index
    render json: Game.all
  end

  def show
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
    render json: game.to_json(include: :players)
  end

  def create
    game = Game.create
    render json: game
  end

  def destroy
    Game.destroy(params[:id])
  end
end
