class RoomsController < ApplicationController
  def index
    rooms = Room.where(is_private: false)
    render json: rooms
  end

  def show
    room = Room.find(params[:id])
    render json: room.as_json(include: { messages: { include: :user } })
  end

  def create
    if params[:room] && params[:room][:name]
      # Public room creation
      room = Room.new(room_params)
      if room.save
        render json: room, status: :created
      else
        render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
      end
    elsif params[:user_id]
      # Private room creation
      user1 = User.find(params[:current_user_id])
      user2 = User.find(params[:user_id])
      
      room = Room.joins(:participants)
                 .where(participants: { user_id: [user1.id, user2.id] }, is_private: true)
                 .group('rooms.id')
                 .having('COUNT(rooms.id) = 2')
                 .first
                 
      if room.nil?
        room = Room.new(is_private: true, name: "Private chat between #{user1.username} and #{user2.username}")
        if room.save
          room.participants.create(user: user1)
          room.participants.create(user: user2)
          render json: room, status: :created
        else
          render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: room
      end
    else
      render json: { error: "Invalid parameters" }, status: :bad_request
    end
  end

  def join
    room = Room.find(params[:id])
    user = User.find(params[:user_id])
    room.users << user unless room.users.include?(user)
    head :ok
  end

  def leave
    room = Room.find(params[:id])
    user = User.find(params[:user_id])
    room.users.delete(user)
    head :ok
  end

  def destroy
    room = Room.find(params[:id])
    room.destroy
    head :no_content
  end

  private

  def room_params
    params.require(:room).permit(:name)
  end
end
