class Api::V1::UsersController
  module UserLogin
    extend ActiveSupport::Concern

    included do
      before_action -> { doorkeeper_authorize! :public, :write, :admin },
                    only: :logout
      before_action :verify_signature!, only: :third_part_login
    end

    def logout
      current_user.devices.find_by(device_id: params[:device_id])&.destroy
      doorkeeper_token.revoke
      render json: { message: 'success' }
    end

    def third_part_login
      auth = auth_hash
      user = Authorization.find_by(
        uid: auth['uid'], provider: auth['provider']
      ).try(:user) || User.create_with_omniauth(auth)

      if user
        token = Doorkeeper::AccessToken.find_or_create_for(
          @client, user.id, @client.scopes, 7200, true
        )
        render json: token
      end
    end

    private

    def auth_hash
      case params[:provider]
      when 'wechat'
        wechat_auth params[:code]
      when 'weibo'
        weibo_auth params
      else
        raise ParameterValueNotAllowed, params[:provider]
      end
    end

    def wechat_auth(code)
      wechat = OmniAuth::Strategies::WeChat.new(
        {},
        client_id: ENV['MOBILE_WECHAT_ID'],
        client_secret: ENV['MOBILE_WECHAT_SECRET']
      )
      token = wechat.client.get_token(
        wechat.token_params.merge(code: code,
                                  grant_type: 'authorization_code',
                                  parse: :json)
      )
      wechat.access_token = token
      wechat.auth_hash
    end

    def weibo_auth(hash)
      weibo = OmniAuth::Strategies::Weibo.new(
        {},
        client_id: ENV['MOBILE_WEIBO_ID'],
        client_secret: ENV['MOBILE_WEIBO_SECRET']
      )
      hash = hash.each_with_object({}) do |(k, v), h|
        h[k.underscore] = v
        h
      end
      token = OAuth2::AccessToken.from_hash(weibo.client, hash)
      weibo.access_token = token
      weibo.auth_hash
    end
  end
end
