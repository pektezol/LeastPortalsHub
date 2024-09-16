import React, { useEffect } from "react";

import RankingEntry from "../components/RankingEntry";
import { Ranking, SteamRanking, RankingType, SteamRankingType } from "../types/Ranking";
import { API } from "../api/Api";

import "../css/Rankings.css";

const Rankings: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = React.useState<Ranking | SteamRanking>();
    const [currentLeaderboard, setCurrentLeaderboard] = React.useState<RankingType[] | SteamRankingType[]>();
    enum LeaderboardTypes {
        official,
        unofficial
    }

    enum RankingCategories {
        rankings_overall,
        rankings_multiplayer,
        rankings_singleplayer
    }
    const [currentLeaderboardType, setCurrentLeaderboardType] = React.useState<RankingCategories>(RankingCategories.rankings_singleplayer);
    const [load, setLoad] = React.useState<boolean>(false);

    interface ResponseSTUPID {
        success: boolean;
        message: string;
        data: SteamRanking;
    }

    const _fetch_rankings = async () => {
        const rankings = await API.get_rankings();
        setLeaderboardData(rankings);
        if (currentLeaderboardType == RankingCategories.rankings_singleplayer) {
            setCurrentLeaderboard(rankings.rankings_singleplayer)
        } else if (currentLeaderboardType == RankingCategories.rankings_multiplayer) {
            setCurrentLeaderboard(rankings.rankings_multiplayer)
        } else {
            setCurrentLeaderboard(rankings.rankings_overall)
        }
        setLoad(true);
    }

    const __dev_fetch_unofficial_rankings = async () => {
        try {
            const response = await fetch("/response.json");
            const result: ResponseSTUPID = await response.json();

            if (result.success) {
                const unofficialRanking: SteamRanking = result.data;
                setLeaderboardData(unofficialRanking);
                if (currentLeaderboardType == RankingCategories.rankings_singleplayer) {
                    // console.log(_sort_rankings_steam(unofficialRanking.rankings_singleplayer))
                    setCurrentLeaderboard(unofficialRanking.rankings_singleplayer)
                } else if (currentLeaderboardType == RankingCategories.rankings_multiplayer) {
                    setCurrentLeaderboard(unofficialRanking.rankings_multiplayer)
                } else {
                    setCurrentLeaderboard(unofficialRanking.rankings_overall)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const _set_current_leaderboard = (ranking_cat: RankingCategories) => {
        if (ranking_cat == RankingCategories.rankings_singleplayer) {
            setCurrentLeaderboard(leaderboardData!.rankings_singleplayer);
        } else if (ranking_cat == RankingCategories.rankings_multiplayer) {
            setCurrentLeaderboard(leaderboardData!.rankings_multiplayer);
        } else {
            setCurrentLeaderboard(leaderboardData!.rankings_overall);
        }

        setCurrentLeaderboardType(ranking_cat);
    }

    const _set_leaderboard_type = (leaderboard_type: LeaderboardTypes) => {
        if (leaderboard_type == LeaderboardTypes.official) {
            _fetch_rankings();
        } else {
            
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
                    <button onClick={() => _fetch_rankings()} className="nav-1-btn">
                        <span>Official (LPHUB)</span>
                    </button>
                    <button onClick={() => __dev_fetch_unofficial_rankings()} className="nav-1-btn">
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
                        return <RankingEntry currentLeaderboardType={currentLeaderboardType} curRankingData={curRankingData} key={i}></RankingEntry>
                    })
                    }
                </div>
            </section>
            : null}
        </main>
    )
}

export default Rankings;
