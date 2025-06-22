class ChatChannel < ApplicationCable::Channel
  def subscribed
    room = Room.find_by(id: params[:room_id])
    user = User.find_by(id: params[:user_id])

    if room && user
      stream_for room
    else
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    Message.create!(
      room_id: data['room_id'],
      user_id: data['user_id'],
      content: data['content']
    )
  end
end
