import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import "./about.css";

export default function About() {
    const [aboutText, setAboutText] = useState('');

    useEffect(() => {
        const fetchReadme = async () => {
            try {
                const response = await fetch(
                    'https://raw.githubusercontent.com/pektezol/LeastPortals/main/README.md'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch README');
                }
                const readmeText = await response.text();
                setAboutText(readmeText);
            } catch (error) {
                console.error('Error fetching README:', error);
            }
        };
        fetchReadme();
    }, []);

    return (
        <div id="about">
            <ReactMarkdown>{aboutText}</ReactMarkdown>
        </div>
    );
};
