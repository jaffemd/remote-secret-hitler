Rails.application.routes.draw do
  resources :games, only: [:show]
  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :destroy, :show]
      resources :players, only: [:create]
    end
  end

  root to: 'home#index'
  get '/*path' => 'home#index'
end
