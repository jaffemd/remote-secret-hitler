class Api::V1::PowersController < ApplicationController
  def view_party
    game.view_party(params[:player_id])
    render json: game.full_json
  end

  def execute
    game.execute(params[:player_id])
    render json: game.full_json
  end

  private

  def game
    room_code = params[:id]
    game = Game.find_by(room_code: room_code)
  end
end
