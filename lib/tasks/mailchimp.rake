namespace :mailchimp do
  desc 'Sync user subscriptions to mailchimp lists'
  task sync: :environment do
    users = User.joins(:preference).where('preferences.updated_at > ?', 1.day.ago)
    users.each do |user|
      p = user.preference
      next if user.email.blank? || (p.email[:enabled] == false && p.created_at == p.updated_at)

      md5 = Digest::MD5.hexdigest(user.email)
      begin
        Gibbon::Request.lists('0d4179c02b').members(md5).upsert(
          body: {
            email_address: user.email,
            status: (p.email[:enabled] == true ? p.subscriptions[:report] : 'unsubscribed')
          }
        )
        Gibbon::Request.lists('a23c3a0517').members(md5).upsert(
          body: {
            email_address: user.email,
            status: (p.email[:enabled] == true ? p.subscriptions[:event] : 'unsubscribed')
          }
        )
      rescue Gibbon::MailChimpError => e
        puts "Houston, we have a problem: #{e.message} - #{e.raw_body}"
      end
    end
  end
end
