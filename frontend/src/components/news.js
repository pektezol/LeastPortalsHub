import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

export default function News({yuh}) {
    // const { token } = prop
    const [news, setNews] = React.useState(null);
    const location = useLocation();

    return (
        <div style={{display: "block", width: "100%"}}>
            {yuh.title}
        </div>
    )
}