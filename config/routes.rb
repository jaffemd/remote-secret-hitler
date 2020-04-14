Rails.application.routes.draw do
  root to: 'home#index'

  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :destroy]
    end
  end
end
