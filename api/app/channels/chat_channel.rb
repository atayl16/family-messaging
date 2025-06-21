class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    Message.create!(
      room_id: params[:room],
      user_id: data['user_id'],
      content: data['message']
    )
  end
end
