#! /usr/bin/env ruby
require 'fileutils'

`crowdin-cli upload sources`
`crowdin-cli download`

# copy xx.yml files to hourofcode.com/i18n
my_dir = Dir["../locales/**/hourofcode/*.yml"]
my_dir.each do |file|
  dest = "../../pegasus/sites.v3/hourofcode.com/i18n"
  FileUtils.cp(file, dest)
end

# remove all metadata
Dir.glob("../../pegasus/sites.v3/hourofcode.com/public/us/**/*.md").each do |file|
  File.write(file, File.read(file).gsub(/^.*\*\s\*\s\*/m, ""))
end

# remove broken social tags from thanks.md
Dir.glob("../../pegasus/sites.v3/hourofcode.com/public/us/**/thanks.md").each do |file|
  File.write(file, File.read(file).gsub(/<% facebook.+?\%>/m, ""))
end

# add social tags to thanks.md
Dir.glob("../../pegasus/sites.v3/hourofcode.com/public/us/**/thanks.md").each do |file|
  File.write(file, '<% facebook = {:u=>"http://#{request.host}/us"}
                      twitter = {:url=>"http://hourofcode.com", :related=>"codeorg", :hashtags=>"", :text=>hoc_s(:twitter_default_text)}
                      twitter[:hashtags] = "HourOfCode" unless hoc_s(:twitter_default_text).include? "#HourOfCode" %>' + File.read(file))
end

# add metadata to resources.md
Dir.glob("../../pegasus/sites.v3/hourofcode.com/public/us/**/resources.md").each do |file|
  File.write(file, "---\nlayout: wide\nnav: resources_nav\n---" + File.read(file))
end


