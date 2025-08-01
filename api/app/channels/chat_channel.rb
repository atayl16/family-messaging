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
    user_id = data['user_id']
    last_message_time = Rails.cache.read("last_message_time_user_#{user_id}")

    if last_message_time && Time.now - last_message_time < 1.second
      # Optionally, send an error back to the user
      # For now, we'll just ignore the message
      return
    end

    sanitized_content = sanitize_content(data['content'])

    Message.create!(
      room_id: data['room_id'],
      user_id: user_id,
      content: sanitized_content
    )

    Rails.cache.write("last_message_time_user_#{user_id}", Time.now, expires_in: 5.seconds)
  end

  private

  def sanitize_content(content)
    return content if PROFANITY_LIST.empty?

    profanity_regex = Regexp.union(PROFANITY_LIST.map { |word| Regexp.new(Regexp.escape(word), Regexp::IGNORECASE) })
    content.gsub(profanity_regex, '****')
  end
end
