class User < ApplicationRecord
  has_secure_password

  has_many :participants
  has_many :rooms, through: :participants
  has_many :messages
end
