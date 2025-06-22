class ChatChannel < ApplicationCable::Channel
  def subscribed
    room = Room.find(params[:room_id])
    self.current_user = User.find(params[:user_id])

    if room && current_user
      stream_for room
    else
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    message = Message.create!(
      room_id: data['room_id'],
      user_id: data['user_id'],
      content: data['content']
    )
    room = Room.find(data['room_id'])
    ChatChannel.broadcast_to(room, message)
  end
end
