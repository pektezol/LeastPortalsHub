# Rankings Algorithm

Unofficial rankings are fetched from Steam. The reason that LPHUB considers Steam leaderboards unofficial is that entries do not require proof, and it is very easy to cheat the portal count in terms of in-game commands and/or otherwise.

The algorithm is close clone of [@NeKz](https://github.com/NeKzor)'s implementation of their lp boards, without including the video showcases and tie counts for each map.

## Fetch Manual Inputs
- records.json
    - Contains all map ids and wrs
- overrides.json
    - Used to replace invalid scores by legit players

## Fetch 5000 Scores for Each Map
- Dictionary of players and map entries are created during the period of fetching all of the maps.
    - First initialize the players dictionary with all players that finished Portal Gun and Doors in their limit portal count. This results in ~200K players as of 2024 Q4.
- Iterate over the rest of the maps and increase the category score and iteration count for each player.
    - If a player from an entry does not exist in the initial dictionary, they are skipped.
    - If a player has a score that is lower than the WR, they are skipped since the score is invalid.
        - If they have an override however, their entry is overriden and becomes valid.
    - If there are more than 5000 scores that have WR for that map, the search goes on until every WR holder is fetched.
    - If there is a specified map limit in the records.json, then all of the scores up to and including that map limit is fetched. Any score above the map limit is skipped.

## Filtering Players Dictionary
- Create seperate arrays for singleplayer, multiplayer, overall rankings.
- Iterate over the players dictionary and add players that completed at least one category to their respective arrays.
    - If player has 51 sp entries, add to sp rankings.
    - If player has 48 mp entries, add to mp rankings.
    - If player has 51 sp entries and 48 mp entries, add to overall rankings.
    - If none of the above, remove player from the dictionary.
- Iterate over the dictionary to get Steam data for each player that has at least one category complete. This results in one API call for each ~300 players as of 2024 Q4.
- Sort the sp, mp, overall rankings arrays by score counts of their respective category.
- Iterate over each rankings arrays and calculate the ranks for each player.

## Exporting Rankings Arrays
- Marshall each array into JSON and output into JSON files.