class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      render json: { message: "User created successfully" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(username: params[:username])
    if user&.authenticate(params[:password])
      render json: { user: { id: user.id, username: user.username } }
    else
      render json: { error: "Invalid username or password" }, status: :unauthorized
    end
  end

  def index
    users = User.all
    render json: users
  end

  def rooms
    user = User.find(params[:id])
    render json: user.rooms
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end
end
