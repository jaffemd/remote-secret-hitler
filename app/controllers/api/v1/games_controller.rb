class Api::V1::GamesController < ApplicationController
  def index
    render json: Game.all
  end

  def create
    game = Game.create(fruit_params)
    render json: game
  end

  def destroy
    Game.destroy(params[:id])
  end

  # private
  #
  # def fruit_params
  #   params.require(:fruit).permit(:id, :name, :description)
  # end
end
