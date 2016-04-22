asset_manifest = Rails.root.join('public', 'static', 'webpack_manifest.json')
if File.exist?(asset_manifest)
  Rails.configuration.webpack[:manifest] = JSON.parse(
    File.read(asset_manifest)
  ).with_indifferent_access
end
