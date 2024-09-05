import { Game } from "./Game";
import { Map } from "./Map";

interface Chapter {
    id: number;
    name: string;
    image: string;
    is_disabled: boolean;
}

export interface GameChapter {
    chapter: Chapter;
    maps: Map[];
}

export interface GamesChapters {
    game: Game;
    chapters: Chapter[];
}