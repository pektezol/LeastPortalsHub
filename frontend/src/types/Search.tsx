import { UserShort } from "./Profile";

export interface Search {
  players: UserShort[];
  maps: SearchMap[];
};

interface SearchMap {
  id: number;
  game: string;
  chapter: string;
  map: string;
};
