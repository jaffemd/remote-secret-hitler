Rails.application.routes.draw do
  root to: 'home#index'

  resources :games, only: [:show]
  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :destroy, :show]
      put '/games/:id/start', to: 'games#start'
      post '/games/join', to: 'games#join'

      resources :players, only: [:create]
    end
  end

  get '/*path' => 'home#index'
end
