class Api::V1::PlayersController < ApplicationController
  def create
    if !(params[:name] && params[:room_code])
      render json: {}, status: :bad_request and return
    end

    game = Game.find_by(room_code: params[:room_code])
    host = game.players.empty?
    player = Player.create(name: params[:name], game: game, host: host)

    render json: player
  end

  def vote
    player = Player.find(params[:id])
    player.update(vote: params[:vote])
    game = player.game
    game.check_voting_finished!
    render json: game.to_json(include: :players)
  end
end
