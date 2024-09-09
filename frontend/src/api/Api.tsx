import axios from 'axios';

import { GameChapter, GamesChapters } from '../types/Chapters';
import { Game } from '../types/Game';
import { Map, MapDiscussion, MapDiscussions, MapLeaderboard, MapSummary } from '../types/Map';
import { MapDiscussionCommentContent, MapDiscussionContent, ModMenuContent } from '../types/Content';
import { Search } from '../types/Search';
import { UserProfile } from '../types/Profile';
import { Ranking } from '../types/Ranking';

// add new api call function entries here
// example usage: API.get_games();
export const API = {
  user_logout: () => user_logout(),

  get_user: (user_id: string) => get_user(user_id),
  get_games: () => get_games(),

  get_chapters: (chapter_id: string) => get_chapters(chapter_id),
  get_games_chapters: (game_id: string) => get_games_chapters(game_id),
  get_game_maps: (game_id: string) => get_game_maps(game_id),
  get_rankings: () => get_rankings(),
  get_search: (q: string) => get_search(q),

  get_map_summary: (map_id: string) => get_map_summary(map_id),
  get_map_leaderboard: (map_id: string) => get_map_leaderboard(map_id),
  get_map_discussions: (map_id: string) => get_map_discussions(map_id),
  get_map_discussion: (map_id: string, discussion_id: number) => get_map_discussion(map_id, discussion_id),

  post_map_summary: (map_id: string, content: ModMenuContent) => post_map_summary(map_id, content),
  post_map_discussion: (map_id: string, content: MapDiscussionContent) => post_map_discussion(map_id, content),
  post_map_discussion_comment: (map_id: string, discussion_id: number, content: MapDiscussionCommentContent) => post_map_discussion_comment(map_id, discussion_id, content),

  put_map_image: (map_id: string, image: string) => put_map_image(map_id, image),
  put_map_summary: (map_id: string, content: ModMenuContent) => put_map_summary(map_id, content),

  delete_map_summary: (map_id: string, route_id: number) => delete_map_summary(map_id, route_id),
  delete_map_discussion: (map_id: string, discussion_id: number) => delete_map_discussion(map_id, discussion_id),
};

const BASE_API_URL: string = "https://lp.ardapektezol.com/api/v1/"

function url(path: string): string {
  return BASE_API_URL + path;
}

// USER

const user_logout = async () => {
  await axios.delete(url("token"));
};

const get_user = async (user_id: string): Promise<UserProfile> => {
  const response = await axios.get(url(`users/${user_id}`))
  return response.data.data;
};


// GAMES

const get_games = async (): Promise<Game[]> => {
  const response = await axios.get(url("games"))
  return response.data.data;
};

const get_chapters = async (chapter_id: string): Promise<GameChapter> => {
  const response = await axios.get(url(`chapters/${chapter_id}`));
  return response.data.data;
}

const get_games_chapters = async (game_id: string): Promise<GamesChapters> => {
  const response = await axios.get(url(`games/${game_id}`));
  return response.data.data;
};

const get_game_maps = async (game_id: string): Promise<Map[]> => {
  const response = await axios.get(url(`games/${game_id}/maps`))
  return response.data.data.maps;
};


// RANKINGS
const get_rankings = async (): Promise<Ranking> => {
  const response = await axios.get(url(`rankings`));
  return response.data.data;
}

// SEARCH

const get_search = async (q: string): Promise<Search> => {
  const response = await axios.get(url(`search?q=${q}`))
  return response.data.data;
};

// MAP SUMMARY

const put_map_image = async (map_id: string, image: string): Promise<boolean> => {
  const response = await axios.put(url(`maps/${map_id}/image`), {
    "image": image,
  });
  return response.data.success;
};

const get_map_summary = async (map_id: string): Promise<MapSummary> => {
  const response = await axios.get(url(`maps/${map_id}/summary`))
  return response.data.data;
};

const post_map_summary = async (map_id: string, content: ModMenuContent): Promise<boolean> => {
  const response = await axios.post(url(`maps/${map_id}/summary`), {
    "user_name": content.name,
    "score_count": content.score,
    "record_date": content.date,
    "showcase": content.showcase,
    "description": content.description,
  });
  return response.data.success;
};

const put_map_summary = async (map_id: string, content: ModMenuContent): Promise<boolean> => {
  const response = await axios.put(url(`maps/${map_id}/summary`), {
    "route_id": content.id,
    "user_name": content.name,
    "score_count": content.score,
    "record_date": content.date,
    "showcase": content.showcase,
    "description": content.description,
  });
  return response.data.success;
};

const delete_map_summary = async (map_id: string, route_id: number): Promise<boolean> => {
  const response = await axios.delete(url(`maps/${map_id}/summary`), {
    data: {
      "route_id": route_id,
    }
  });
  return response.data.success;
};

// MAP LEADERBOARDS

const get_map_leaderboard = async (map_id: string): Promise<MapLeaderboard | undefined> => {
  const response = await axios.get(url(`maps/${map_id}/leaderboards`))
  if (!response.data.success) {
    return undefined;
  }
  const data = response.data.data;
  // map the kind of leaderboard
  data.records = data.records.map((record: any) => {
    if (record.host && record.partner) {
      return { ...record, kind: 'multiplayer' };
    } else {
      return { ...record, kind: 'singleplayer' };
    }
  });
  // should be unreachable
  return undefined;
};

// MAP DISCUSSIONS

const get_map_discussions = async (map_id: string): Promise<MapDiscussions | undefined> => {
  const response = await axios.get(url(`maps/${map_id}/discussions`));
  if (!response.data.data.discussions) {
    return undefined;
  }
  return response.data.data;
};

const get_map_discussion = async (map_id: string, discussion_id: number): Promise<MapDiscussion | undefined> => {
  const response = await axios.get(url(`maps/${map_id}/discussions/${discussion_id}`));
  if (!response.data.data.discussion) {
    return undefined;
  }
  return response.data.data;
};

const post_map_discussion = async (map_id: string, content: MapDiscussionContent): Promise<boolean> => {
  const response = await axios.post(url(`maps/${map_id}/discussions`), {
    "title": content.title,
    "content": content.content,
  });
  return response.data.success;
};

const post_map_discussion_comment = async (map_id: string, discussion_id: number, content: MapDiscussionCommentContent): Promise<boolean> => {
  const response = await axios.post(url(`maps/${map_id}/discussions/${discussion_id}`), {
    "comment": content.comment,
  });
  return response.data.success;
};

const delete_map_discussion = async (map_id: string, discussion_id: number): Promise<boolean> => {
  const response = await axios.delete(url(`maps/${map_id}/discussions/${discussion_id}`));
  return response.data.success;
};
