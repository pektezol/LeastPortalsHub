import React from 'react';
import { Link } from "react-router-dom";
import { RankingType } from '../types/Ranking';

interface RankingEntryProps {
    curRankingData: RankingType;
};

const RankingEntry: React.FC<RankingEntryProps> = (curRankingData) => {
    return (
        <div className='leaderboard-entry'>
            <span>{curRankingData.curRankingData.placement}</span>
            <div>
            <Link to={`/users/${curRankingData.curRankingData.user.steam_id}`}>           
                <img src={curRankingData.curRankingData.user.avatar_link}></img>
                <span>{curRankingData.curRankingData.user.user_name}</span>
            </Link>
            </div>
            <span>{curRankingData.curRankingData.total_score}</span>
        </div>
    )
}

export default RankingEntry;
