import React from 'react';
import { PortalIcon } from '../images/Images';

const Homepage: React.FC = () => {

    return (
        <main>
            <section>
                <h1><img src={PortalIcon}/>Welcome to Least Portals Hub!</h1>
                <p>At the moment, LPHUB is in beta state. This means that the site has only the core functionalities enabled for providing both collaborative information and competitive leaderboards.</p>
                <p>Site should feel intuitive to navigate around. For any type of feedback, reach us at LPHUB Discord server.</p>
                <p>By using LPHUB, you agree that you have read the 'Leaderboard Rules' and the 'About P2LP' pages.</p>
            </section>
        </main>
    );
};

export default Homepage;
