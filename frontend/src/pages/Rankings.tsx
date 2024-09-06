import React, { useEffect } from "react";

import RankingEntry from "../components/RankingEntry";
import { Ranking, RankingType } from "../types/Ranking";
import { API } from "../api/Api";

import "../css/Rankings.css";

const Rankings: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = React.useState<Ranking>();
    const [currentLeaderboardCat, setCurrentLeaderboardCat] = React.useState<RankingCategories>();
    const [currentLeaderboard, setCurrentLeaderboard] = React.useState<RankingType[]>();
    const [load, setLoad] = React.useState<boolean>(false);

    enum RankingCategories {
        rankings_overall,
        rankings_multiplayer,
        rankings_singleplayer
    }

    const _fetch_rankings = async () => {
        const rankings = await API.get_rankings();
        setLeaderboardData(rankings);
        setLoad(true);
    }

    const _set_current_leaderboard = (ranking_cat: RankingCategories) => {
        if (ranking_cat == RankingCategories.rankings_singleplayer) {
            setCurrentLeaderboard(leaderboardData!.rankings_singleplayer);
        } else if (ranking_cat == RankingCategories.rankings_multiplayer) {
            setCurrentLeaderboard(leaderboardData!.rankings_multiplayer);
        } else {
            setCurrentLeaderboard(leaderboardData!.rankings_overall);
        }
    }

    useEffect(() => {
        _fetch_rankings();
        if (load) {
            _set_current_leaderboard(RankingCategories.rankings_singleplayer);
        }
    }, [load])

    return (
        <main>
            <section className="nav-container nav-1">
                <div>
                    <button className="nav-1-btn">
                        <span>Official (LPHUB)</span>
                    </button>
                    <button className="nav-1-btn">
                        <span>Unofficial (Steam)</span>
                    </button>
                </div>
            </section>
            <section className="nav-container nav-2">
                <div>
                    <button onClick={() => _set_current_leaderboard(RankingCategories.rankings_singleplayer)} className="nav-2-btn">
                        <span>Singleplayer</span>
                    </button>
                    <button onClick={() => _set_current_leaderboard(RankingCategories.rankings_multiplayer)} className="nav-2-btn">
                        <span>Cooperative</span>
                    </button>
                    <button onClick={() => _set_current_leaderboard(RankingCategories.rankings_overall)} className="nav-2-btn">
                        <span>Overall</span>
                    </button>
                </div>
            </section>

            {load ?
            <section className="rankings-leaderboard">
                <div className="ranks-container">
                    <div className="leaderboard-entry header">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Portals</span>
                    </div>

                    <div className="splitter"></div>

                    {currentLeaderboard?.map((curRankingData, i) => {
                        return <RankingEntry curRankingData={curRankingData} key={i}></RankingEntry>
                    })
                    }
                </div>
            </section>
            : null}
        </main>
    )
}

export default Rankings;
