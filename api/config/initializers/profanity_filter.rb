require 'open-uri'

BAD_WORDS_URL = "https://raw.githubusercontent.com/zacanger/profane-words/master/words.json"

begin
  bad_words_json = URI.open(BAD_WORDS_URL).read
  PROFANITY_LIST = JSON.parse(bad_words_json)
rescue OpenURI::HTTPError, JSON::ParserError => e
  puts "Could not load profanity list: #{e.message}"
  PROFANITY_LIST = []
end 
