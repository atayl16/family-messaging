class AddRoomToMessages < ActiveRecord::Migration[7.0]
  def change
    add_reference :messages, :room, null: false, foreign_key: true
  end
end
