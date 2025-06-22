class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room

  after_create_commit do
    broadcast_message
    add_mentioned_users
  end

  private

  def broadcast_message
    ChatChannel.broadcast_to(room, self.as_json(include: :user))
  end

  def add_mentioned_users
    mentions = content.scan(/@(\w+)/).flatten
    mentions.each do |username|
      user = User.find_by(username: username)
      if user && !room.users.include?(user)
        room.users << user
      end
    end
  end
end
