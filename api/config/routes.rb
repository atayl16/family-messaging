Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root to: proc { [200, {}, ['OK']] }

  resources :users, only: [:create, :index] do
    get :rooms, on: :member
  end

  resources :rooms, only: [:index, :show, :create] do
    member do
      post :join
      delete :leave
    end
    resources :messages, only: [:index, :create]
  end

  post "/login", to: "users#login"
end
