import { useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import GeoIntroduction from './GeoIntroduction';

const GeoButton = ({ currentAlgorithm, algorithmState, onAlgorithmUnlock }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    const getExplanationContent = () => {
        const algorithmExplanations = {
            'bfs': {
                title: "BFS (Breadth-First Search) 🌊",
                explanation: "BFS explores like ripples in a pond - expanding outward in all directions equally. It guarantees the shortest path if all roads have the same cost.",
                drawbacks: "BFS can be slow because it explores everywhere, even paths going away from the destination. It treats all roads equally.",
                nextAlgorithm: "dfs",
                nextInfo: "Next, try DFS (Depth-First Search) - it dives deep down one path instead of expanding outward."
            },
            'dfs': {
                title: "DFS (Depth-First Search) 🕳️",
                explanation: "DFS dives deep down one path until it hits a dead end, then backtracks. It's like exploring a maze by always taking the first available turn.",
                drawbacks: "DFS can get lost exploring very long paths that lead nowhere. It might miss shorter routes because it doesn't explore systematically.",
                nextAlgorithm: "bidirectional",
                nextInfo: "Next, try Bidirectional BFS - it searches from both start and end simultaneously to meet in the middle."
            },
            'bidirectional': {
                title: "Bidirectional BFS 🔄",
                explanation: "This runs BFS from both the start and goal simultaneously. When the two search areas meet, you've found the path!",
                drawbacks: "While faster than regular BFS, it still explores uniformly in all directions from both ends.",
                nextAlgorithm: "greedy",
                nextInfo: "Next, try Greedy Search - it adds direction by always moving toward the goal."
            },
            'greedy': {
                title: "Greedy Search 🍟",
                explanation: "Greedy always chooses the path that looks closest to the goal (like heading toward McDonald's). It uses the straight-line distance as a guide.",
                drawbacks: "Greedy can get stuck in loops or take longer routes because it's too focused on the immediate goal direction.",
                nextAlgorithm: "astar",
                nextInfo: "Next, try A* - it combines Greedy's direction with BFS's systematic approach."
            },
            'astar': {
                title: "A* Search 🧠",
                explanation: "A* is like Greedy with a brain. It balances the cost to reach a point (g) with the estimated distance to goal (h). Formula: f(n) = g(n) + h(n).",
                drawbacks: "A* is quite efficient, but we can make it even faster by running it from both ends!",
                nextAlgorithm: "bidirectional-astar",
                nextInfo: "Next, try Bidirectional A* - A* running from both start and goal simultaneously."
            },
            'bidirectional-astar': {
                title: "Bidirectional A* ⚡",
                explanation: "This runs A* from both start and goal, combining the best of A* intelligence with bidirectional speed.",
                drawbacks: "Even this can be optimized! Real systems like Google Maps use precomputed shortcuts.",
                nextAlgorithm: "bidirectional-astar-lookup",
                nextInfo: "Finally, try A* + Lookup Table - it uses precomputed highway shortcuts for even faster routing."
            },
            'bidirectional-astar-lookup': {
                title: "A* + Lookup Table 🛣️",
                explanation: "This is how Google Maps works! It precomputes major routes (highways) and only calculates local roads in real-time.",
                drawbacks: "This is the most advanced algorithm - you've mastered them all!",
                nextAlgorithm: null,
                nextInfo: "Congratulations! You've learned how Google Maps finds the fastest routes. Try experimenting with different map areas!"
            }
        };

        return algorithmExplanations[currentAlgorithm] || {
            title: "Welcome to Pathfinding! 🗺️",
            explanation: "Hi! I'm Geo, your guide to understanding how Google Maps works! I'll explain each algorithm after you try it.",
            drawbacks: "First, set two points on the map by clicking. Then try BFS (Breadth-First Search) - it's the most basic algorithm and perfect for beginners.",
            nextAlgorithm: null,
            nextInfo: "Click the BFS button at the bottom to get started, then click me again for explanations!"
        };
    };

    const handleGeoClick = () => {
        setShowExplanation(true);
    };

    const handleClose = () => {
        setShowExplanation(false);
        const content = getExplanationContent();
        if (content.nextAlgorithm && onAlgorithmUnlock) {
            onAlgorithmUnlock(content.nextAlgorithm);
        }
    };

    return (
        <>
            <Zoom in={true}>
                <Fab
                    onClick={handleGeoClick}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '20px',
                        zIndex: 1000,
                        backgroundColor: '#46B780',
                        width: '70px',
                        height: '70px',
                        boxShadow: '0 8px 25px rgba(70, 183, 128, 0.4)',
                        border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    <img 
                        src="./pics/first.png" 
                        alt="Geo"
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                </Fab>
            </Zoom>

            {showExplanation && (
                <GeoIntroduction
                    event={{
                        character: 'geo',
                        characterImage: 'first.png',
                        dialogue: {
                            title: getExplanationContent().title,
                            message: `${getExplanationContent().explanation}\n\n${getExplanationContent().drawbacks}\n\n${getExplanationContent().nextInfo}`,
                            hasNext: false,
                            isClosing: true
                        },
                        position: 'center',
                        backdrop: true
                    }}
                    onNext={() => {}}
                    onClose={handleClose}
                    onSkip={handleClose}
                />
            )}
        </>
    );
};

export default GeoButton; 