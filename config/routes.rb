Rails.application.routes.draw do
  root to: 'home#index'

  resources :games, only: [:show]
  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :destroy, :show]
      post '/games/join', to: 'games#join'
      put '/games/:id/start', to: 'games#start'
      put '/games/:id/open_voting', to: 'games#open_voting'
      put '/games/:id/new_election', to: 'games#new_election'
      put '/games/:id/legislative_session', to: 'games#legislative_session'
      put '/games/:id/choose_card', to: 'games#choose_card'
      put '/games/:id/president', to: 'games#update_president'
      put '/games/:id/chancellor', to: 'games#update_chancellor'

      resources :players, only: [:create]
      put '/players/:id/vote', to: 'players#vote'
    end
  end

  get '/*path' => 'home#index'
end
