import { UserShort } from "./Profile";

export interface RankingType {
    placement: number;
    user: UserShort;
    total_score: number;
}

export interface Ranking {
    rankings_overall: RankingType[];
    rankings_singleplayer: RankingType[];
    rankings_multiplayer: RankingType[];
}