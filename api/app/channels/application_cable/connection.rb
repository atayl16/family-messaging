module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      # No longer authenticating here.
      # The user will be found and assigned in the channel.
    end

    private

    def find_verified_user
      if verified_user = User.find_by(id: request.params[:user_id])
        verified_user
      else
        reject_unauthorized_connection
      end
    end

    def ip_allowed?
      request_ip = IPAddr.new(request.remote_ip)
      MOROCCAN_IP_RANGES.any? { |range| range.include?(request_ip) }
    end
  end
end 
