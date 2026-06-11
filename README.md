# PokéErez.com
This is the official website of PokéTuber Erez, aka PokéErez, which includes links and various embeds for his socials, and other websites.

## Pages
*Square brackets indicate path, all paths are case insensitive.*

### Home Page [/]
Broad details, including links, about the channel and the various related accounts, used as a sort of landing page.

### YouTube [/YouTube]
Details on the main PokéErez YouTube channel, which has live-stream VODs, non streamed videos, and shorts of (mostly) clips. Page includes embeds for the latest video,  live-stream and short on the channel.

### Twitch [/Twitch]
Details on the PokéErez Twitch channel, used for live-streams, and has limited VODs. Page includes embeds for the live-stream and chat.

### Stream Schedule [/Schedule]
Details on Erez's live-stream schedule. Page includes a calendar embed, which stays up-to-date in case there's a change in schedule.

### Twitter [/Twitter]
Details on Erez's main Twitter account, which is used for channel updates, and general ramblings. Page includes a third-party profile embed.

### Bluesky [/Bluesky]
Details on Erez's main Bluesky account, which currently has the same posts as the Twitter account, channel updates and general ramblings. Page includes a third-party profile embed.

### Shiny Collection [/Collection]
Erez is a shiny hunter, with a collection big enough to be more easily tracked with a spreadsheet, that's embedded in this page. The spreadsheet details the catch date and method of each shiny, tracks various numbers and statistics, and is tightly linked to the series of YouTube videos where Erez showcases his collection.

### ErOr Bros. [/ErOrBros]
Erez's non-Pokémon focused YouTube channel ~~technically~~ co-owned by his brother. Page includes social links for the channel's accounts and an embed of the channel's latest video or live-stream.

### Random Pokémon Generator [/Randomizer]
Details on one of Erez's two other websites, a random Pokémon generator, where users can select filters or a custom list of Pokémon, and the site selects species out of those in random. Page includes a link and picture filled guide for the website.

### The Name Game [/NameGame]
Details on one of Erez's two other websites, a game conceptualized by Erez called The Name Game, where the user is presented with with a Pokémon name in a latin based, non-English language, and needs to guess which Pokémon it is, aided by a few optional hints. Page includes a link and picture filled guide for the website.

### Guess Who Guide [/GuessWho]
Technically not a page on the website, but a redirection route to a [GitHub guide](https://github.com/erezushi/pokeerez_com/tree/master/app/api/game) for setting up and using Erez's Pokémon Guess Who game on stream chat bots.

## API Routes
*responses are text formatted to support calls from stream chat bots*

### Pokédex [/api/pokedex]
Get various bits of information about a Pokémon species.

Query Parameters:
* pokemon - Pokémon specie name.
* form (optional) - Specific Pokémon form.
* info (optional) - Which kind of information to return.
  * generic (default) - Type, National Dex number and abilities.
  * numbers - All of the Pokémon dex numbers across the series.
  * evolution - Details on the Pokémon's evolution line, including the species and evolution methods.

### Pokémon Guess Who [/api/game]
*[Full details here](https://github.com/erezushi/pokeerez_com/tree/master/app/api/game)*

Pick a type or Pokémon generation, and a random corresponding Pokémon is selected, with the other bit of information returned. Try to guess the Pokémon.

Query Parameters:
  * key - UUID for the game instance played on (required for all calls except for making a new instance).
  * user - Username of the person making the call (required for all calls).
  * action - Which action to perform (required for all calls).
    * key - Make a new game instance (sets the user as instance manager).
    * start - Start a new game.
    * guess - Make a guess.
    * hint - Ask for a hint in the form of a random Pokédex entry.
    * leaderboard - Get the top 5 guessers of the instance.
    * reset - Stop an active game (can only be used by instance manager).
  * payload - Extra parameter used by some actions.
    * start - The filter for the game (Pokémon type or generation number).
    * guess - The guessed specie.
    * reset (optional) - set to `true` to delete the game manager's score from the instance.
