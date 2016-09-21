
module Role
  CONFIG_FILE = "#{Rails.root}/config/roles.yml".freeze
  CONFIG = YAML.load_file(CONFIG_FILE).deep_symbolize_keys!.freeze

  def self.default
    CONFIG[:default]
  end

  def self.roles
    CONFIG[:roles].keys
  end

  def self.role_name(role)
    CONFIG[:roles][role.intern][:name]
  end

  def self.role_description(role)
    CONFIG[:roles][role.intern][:description]
  end
end
