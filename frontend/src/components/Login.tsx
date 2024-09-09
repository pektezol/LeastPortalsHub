import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ExitIcon, UserIcon, LoginIcon } from '../images/Images';
import { UserProfile } from '../types/Profile';
import { API } from '../api/Api';
import "../css/Login.css";

interface LoginProps {
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  profile?: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
};

const Login: React.FC<LoginProps> = ({ token, setToken, profile, setProfile }) => {

  const navigate = useNavigate();

  const _logout = () => {
    setProfile(undefined);
    setToken(undefined);
    API.user_logout();
    navigate("/");
  }

  return (
    <>
      {profile
        ?
        (
          <>
            <Link to="/profile" tabIndex={-1} className='login'>
              <button className='sidebar-button'>
                <img src={profile.avatar_link} alt="" />
                <span>{profile.user_name}</span>
              </button>
              <button className='logout-button' onClick={_logout}>
                <img src={ExitIcon} alt="" /><span></span>
              </button>
            </Link>
          </>
        )
        :
        (
          <Link to="/api/v1/login" tabIndex={-1} className='login' >
            <button className='sidebar-button' onClick={() => {
              setProfile({
                "profile": true,
                "steam_id": "76561198131629989",
                "user_name": "BiSaXa",
                "avatar_link": "https://avatars.steamstatic.com/fa7f64c79b247c8a80cafbd6dd8033b98cc1153c_full.jpg",
                "country_code": "TR",
                "titles": [
                  {
                    "name": "Admin",
                    "color": "ce6000"
                  },
                  {
                    "name": "Moderator",
                    "color": "4a8b00"
                  }
                ],
                "links": {
                  "p2sr": "-",
                  "steam": "-",
                  "youtube": "-",
                  "twitch": "-"
                },
                "rankings": {
                  "overall": {
                    "rank": 1,
                    "completion_count": 4,
                    "completion_total": 105
                  },
                  "singleplayer": {
                    "rank": 1,
                    "completion_count": 3,
                    "completion_total": 57
                  },
                  "cooperative": {
                    "rank": 1,
                    "completion_count": 1,
                    "completion_total": 48
                  }
                },
                "records": [
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 3,
                    "map_name": "Portal Gun",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 350,
                        "demo_id": "e9ec0b83-7b95-4fa9-b974-2245fb79d5ca",
                        "score_count": 0,
                        "score_time": 3968,
                        "date": "2023-09-23T14:57:35.430781Z"
                      },
                      {
                        "record_id": 282,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 4,
                    "map_name": "Smooth Jazz",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 283,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 5,
                    "map_name": "Cube Momentum",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 284,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 6,
                    "map_name": "Future Starter",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 351,
                        "demo_id": "d5ee2227-e195-4e8d-bd1d-746b17538df7",
                        "score_count": 2,
                        "score_time": 71378,
                        "date": "2023-09-23T15:11:16.579757Z"
                      },
                      {
                        "record_id": 285,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 7,
                    "map_name": "Secret Panel",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 352,
                        "demo_id": "64ca612d-4586-40df-9cf3-850c270b5592",
                        "score_count": 0,
                        "score_time": 10943,
                        "date": "2023-09-23T15:19:15.413596Z"
                      },
                      {
                        "record_id": 286,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 1,
                    "map_id": 9,
                    "map_name": "Incinerator",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 287,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 10,
                    "map_name": "Laser Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 288,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 11,
                    "map_name": "Laser Stairs",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 289,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 12,
                    "map_name": "Dual Lasers",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 290,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 13,
                    "map_name": "Laser Over Goo",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 291,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 14,
                    "map_name": "Catapult Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 338,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 15,
                    "map_name": "Trust Fling",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 292,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 16,
                    "map_name": "Pit Flings",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 293,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 2,
                    "map_id": 17,
                    "map_name": "Fizzler Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 294,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 18,
                    "map_name": "Ceiling Catapult",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 295,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 19,
                    "map_name": "Ricochet",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 296,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 20,
                    "map_name": "Bridge Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 297,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 21,
                    "map_name": "Bridge The Gap",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 298,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 22,
                    "map_name": "Turret Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 299,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 23,
                    "map_name": "Laser Relays",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 300,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 24,
                    "map_name": "Turret Blocker",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 301,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 25,
                    "map_name": "Laser vs Turret",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 302,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 3,
                    "map_id": 26,
                    "map_name": "Pull The Rug",
                    "map_wr_count": 0,
                    "placement": 2,
                    "scores": [
                      {
                        "record_id": 303,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 4,
                    "map_id": 27,
                    "map_name": "Column Blocker",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 304,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 4,
                    "map_id": 28,
                    "map_name": "Laser Chaining",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 305,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 4,
                    "map_id": 29,
                    "map_name": "Triple Laser",
                    "map_wr_count": 0,
                    "placement": 2,
                    "scores": [
                      {
                        "record_id": 337,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 4,
                    "map_id": 30,
                    "map_name": "Jail Break",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 306,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 4,
                    "map_id": 31,
                    "map_name": "Escape",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 307,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 5,
                    "map_id": 32,
                    "map_name": "Turret Factory",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 308,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 5,
                    "map_id": 33,
                    "map_name": "Turret Sabotage",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 309,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 5,
                    "map_id": 34,
                    "map_name": "Neurotoxin Sabotage",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 310,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 5,
                    "map_id": 35,
                    "map_name": "Core",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 311,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 36,
                    "map_name": "Underground",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 353,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 37,
                    "map_name": "Cave Johnson",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 313,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 38,
                    "map_name": "Repulsion Intro",
                    "map_wr_count": 0,
                    "placement": 2,
                    "scores": [
                      {
                        "record_id": 314,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 39,
                    "map_name": "Bomb Flings",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 315,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 40,
                    "map_name": "Crazy Box",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 316,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 6,
                    "map_id": 41,
                    "map_name": "PotatOS",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 317,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 7,
                    "map_id": 42,
                    "map_name": "Propulsion Intro",
                    "map_wr_count": 0,
                    "placement": 2,
                    "scores": [
                      {
                        "record_id": 362,
                        "demo_id": "51453c2b-79a4-4fab-81bf-442cbbc997d6",
                        "score_count": 3,
                        "score_time": 856,
                        "date": "2023-11-06T15:45:52.867581Z"
                      },
                      {
                        "record_id": 318,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 7,
                    "map_id": 43,
                    "map_name": "Propulsion Flings",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 319,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 7,
                    "map_id": 44,
                    "map_name": "Conversion Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 320,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 7,
                    "map_id": 45,
                    "map_name": "Three Gels",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 321,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 46,
                    "map_name": "Test",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 322,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 47,
                    "map_name": "Funnel Intro",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 323,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 48,
                    "map_name": "Ceiling Button",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 324,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 49,
                    "map_name": "Wall Button",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 325,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 50,
                    "map_name": "Polarity",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 326,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 51,
                    "map_name": "Funnel Catch",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 327,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 52,
                    "map_name": "Stop The Box",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 328,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 53,
                    "map_name": "Laser Catapult",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 329,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 54,
                    "map_name": "Laser Platform",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 330,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 55,
                    "map_name": "Propulsion Catch",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 331,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 8,
                    "map_id": 56,
                    "map_name": "Repulsion Polarity",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 332,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 9,
                    "map_id": 57,
                    "map_name": "Finale 1",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 333,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 9,
                    "map_id": 58,
                    "map_name": "Finale 2",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 334,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 9,
                    "map_id": 59,
                    "map_name": "Finale 3",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 335,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 1,
                    "category_id": 9,
                    "map_id": 60,
                    "map_name": "Finale 4",
                    "map_wr_count": 1,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 336,
                        "demo_id": "27b3a03e-56a3-4df3-b9bf-448fc0cbf1e7",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:09:11.602056Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 63,
                    "map_name": "Doors",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 5,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 64,
                    "map_name": "Buttons",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 6,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 65,
                    "map_name": "Lasers",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 7,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 66,
                    "map_name": "Rat Maze",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 8,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 67,
                    "map_name": "Laser Crusher",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 9,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 11,
                    "map_id": 68,
                    "map_name": "Behind The Scenes",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 10,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 69,
                    "map_name": "Flings",
                    "map_wr_count": 4,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 11,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 70,
                    "map_name": "Infinifling",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 12,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 71,
                    "map_name": "Team Retrieval",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 13,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 72,
                    "map_name": "Vertical Flings",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 14,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 73,
                    "map_name": "Catapults",
                    "map_wr_count": 4,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 15,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 74,
                    "map_name": "Multifling",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 16,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 75,
                    "map_name": "Fling Crushers",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 17,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 12,
                    "map_id": 76,
                    "map_name": "Industrial Fan",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 18,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 77,
                    "map_name": "Cooperative Bridges",
                    "map_wr_count": 3,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 19,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 78,
                    "map_name": "Bridge Swap",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 20,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 79,
                    "map_name": "Fling Block",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 4,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 0,
                        "score_time": 43368,
                        "date": "2023-08-30T13:16:56.91335Z"
                      },
                      {
                        "record_id": 21,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 80,
                    "map_name": "Catapult Block",
                    "map_wr_count": 4,
                    "placement": 2,
                    "scores": [
                      {
                        "record_id": 22,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 81,
                    "map_name": "Bridge Fling",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 23,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 82,
                    "map_name": "Turret Walls",
                    "map_wr_count": 4,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 24,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 83,
                    "map_name": "Turret Assasin",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 25,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 13,
                    "map_id": 84,
                    "map_name": "Bridge Testing",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 26,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 85,
                    "map_name": "Cooperative Funnels",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 27,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 86,
                    "map_name": "Funnel Drill",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 28,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 87,
                    "map_name": "Funnel Catch",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 29,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 88,
                    "map_name": "Funnel Laser",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 30,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 89,
                    "map_name": "Cooperative Polarity",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 31,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 90,
                    "map_name": "Funnel Hop",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 32,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 91,
                    "map_name": "Advanced Polarity",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 33,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 92,
                    "map_name": "Funnel Maze",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 34,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 14,
                    "map_id": 93,
                    "map_name": "Turret Warehouse",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 35,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 94,
                    "map_name": "Repulsion Jumps",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 36,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 95,
                    "map_name": "Double Bounce",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 37,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 96,
                    "map_name": "Bridge Repulsion",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 38,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 97,
                    "map_name": "Wall Repulsion",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 39,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 98,
                    "map_name": "Propulsion Crushers",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 40,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 99,
                    "map_name": "Turret Ninja",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 41,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 100,
                    "map_name": "Propulsion Retrieval",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 42,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 15,
                    "map_id": 101,
                    "map_name": "Vault Entrance",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 43,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 102,
                    "map_name": "Separation",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 44,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 103,
                    "map_name": "Triple Axis",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 45,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 104,
                    "map_name": "Catapult Catch",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 46,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 105,
                    "map_name": "Bridge Gels",
                    "map_wr_count": 2,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 47,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 106,
                    "map_name": "Maintenance",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 48,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 107,
                    "map_name": "Bridge Catch",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 49,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 108,
                    "map_name": "Double Lift",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 50,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 109,
                    "map_name": "Gel Maze",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 51,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  },
                  {
                    "game_id": 2,
                    "category_id": 16,
                    "map_id": 110,
                    "map_name": "Crazier Box",
                    "map_wr_count": 0,
                    "placement": 1,
                    "scores": [
                      {
                        "record_id": 52,
                        "demo_id": "b8d6adc2-d8b7-41e4-8faf-63f246d910cd",
                        "score_count": 31,
                        "score_time": 9999,
                        "date": "2023-09-03T19:12:05.958456Z"
                      }
                    ]
                  }
                ],
                "pagination": {
                  "total_records": 0,
                  "total_pages": 0,
                  "current_page": 0,
                  "page_size": 0
                }

              }

              )
            }}>
              <img src={UserIcon} alt="" />
              <span>
                <img src={LoginIcon} alt="Sign in through Steam" />
              </span>
            </button>
          </Link>
        )}
    </>
  );
};

export default Login;
