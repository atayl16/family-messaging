class MessagesController < ApplicationController
  before_action :set_room

  def index
    messages = @room.messages.includes(:user).order(created_at: :asc)
    render json: messages.as_json(include: :user)
  end

  def create
    message = @room.messages.new(message_params)
    if message.save
      render json: message.as_json(include: :user), status: :created
    else
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  end

  def message_params
    params.require(:message).permit(:content, :user_id)
  end
end
