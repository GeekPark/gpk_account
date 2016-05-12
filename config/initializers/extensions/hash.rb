class Hash
  def flatten_nested
    each_with_object({}) do |(k, v), h|
      if v.is_a? Hash
        v.flatten_nested.map { |h_k, h_v| h["#{k}.#{h_k}"] = h_v }
      else
        h[k] = v
      end
    end
  end
end
