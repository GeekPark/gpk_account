module Warden
  module Mixins
    module Common
      def request
        @request ||= ActionDispatch::Request.new(env)
      end

      def cookies
        request.cookie_jar
      end
    end
  end
end
