import { useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import GeoIntroduction from './GeoIntroduction';

const GeoButton = ({ pendingConversation, onConversationComplete, onAlgorithmUnlock, onShowGoogleMaps }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    const getConversationContent = (conversationId) => {
        if (!conversationId) {
            return {
                title: "Welcome to Google Maps Explained!",
                explanation: "Hi! I'm Geo, your guide to understanding how Google Maps works!",
                nextInfo: "Click on an algorithm to learn about it.",
                unlockAlgorithm: null
            };
        }

        const conversations = {
            'welcome': {
                title: "Welcome to Google Maps Explained!",
                explanation: "Hi! I'm Geo, your guide to understanding how Google Maps works! Today we'll explore the algorithms that power navigation apps.",
                nextInfo: "First, set two points on the map by clicking, then right clicking. We'll start with the most basic algorithm - BFS (Breadth-First Search).",
                unlockAlgorithm: 'bfs',
                characterImage: 'first.png'
            },
            'bfs': {
                title: "BFS (Breadth-First Search)",
                explanation: "BFS explores nodes level by level, like ripples spreading in water. It guarantees the shortest path if all edges have the same cost, but it wastes time checking everything equally.",
                nextInfo: "Imagine dropping a stone in a pond - the ripples expand outward evenly. Try it now!",
                unlockAlgorithm: 'bfs',
                characterImage: 'first.png'
            },
            'dfs': {
                title: "DFS (Depth-First Search)",
                explanation: "Another approach is DFS. DFS dives deep down one path before backtracking. It uses less memory than BFS, but it can miss the shortest path and wander a lot.",
                nextInfo: "It’s like your uncle driving in a new city, making random turns and only later realizing he’s lost. Not the best for navigation!",
                unlockAlgorithm: 'dfs',
                characterImage: 'thinking.png'
            },
            'bidirectional': {
                title: "Bidirectional BFS",
                explanation: "So lets stick with BFS and see how we can optimize it! Instead of expanding one giant circle from start to goal, bidirectional BFS expands two smaller circles that meet in the middle. Since the area of two smaller circles is less than one big circle, the search space shrinks dramatically.",
                nextInfo: "It’s like two people walking toward each other instead of one person making the whole trip. Faster and smarter!",
                unlockAlgorithm: 'bidirectional',
                characterImage: 'tired.png'
            },
            'greedy': {
                title: "Greedy Search",
                explanation: "Bidirectional BFS works great! But its still not the most efficient because we end up exploring a lot of roads in the wrong direction. Greedy search always picks the node that seems closest to the goal based on a heuristic. It’s fast, but it doesn’t guarantee the shortest path and can get trapped.",
                nextInfo: "Think of heading straight toward McDonald's because you see the sign. Quick—but what if there’s a river in the way?",
                unlockAlgorithm: 'greedy',
                characterImage: 'reading_map.png'
            },
            'astar': {
                title: "A* Search",
                explanation: "A* fixes greedy’s flaw by balancing two things: distance traveled so far (g) and estimated stright-line distance left (h). The total cost is f(n) = g(n) + h(n). This makes it both optimal and efficient if the heuristic is good.",
                nextInfo: "It’s like being smart about both how far you’ve gone and how much is left. That’s why A* is the go-to for pathfinding!",
                unlockAlgorithm: 'astar',
                characterImage: 'first.png'
            },
            'bidirectional-astar': {
                title: "Bidirectional A*",
                explanation: "By running A* from both the start and the goal, the search space shrinks even more. It’s just like what we did to optimize BFS!",
                nextInfo: "Navigation systems love this trick because it’s fast *and* optimal.",
                unlockAlgorithm: 'bidirectional-astar',
                characterImage: 'smirk.png'
            },
            'bidirectional-astar-lookup': {
                title: "A* + Lookup Table",
                explanation: "Running a lot faster right? We're almost there! Real systems like Google Maps don’t calculate everything in real time. They precompute popular shortcuts that everyone uses (usually highways) in lookup tables to save compute power and only calculate the local streets dynamically. I made a lookup table here based on the points you would chose, but the real lookup tables are done for longer distances. Computing a lookup table for eevery short distance route out there would be an almost infinitely large table!",
                nextInfo: "The long distance lookup tables are what make Maps feels instant—you’re not waiting for math, just a quick lookup and some local fine-tuning.",
                unlockAlgorithm: 'bidirectional-astar-lookup',
                characterImage: 'beach.png'
            },
            'final': {
                title: "Congratulations!",
                explanation: "You’ve mastered all the core pathfinding algorithms! From BFS to advanced A* with precomputation, you now know the building blocks of navigation systems.",
                nextInfo: "Ready to see how it all comes together? Let’s explore the complete Google Maps system!",
                unlockAlgorithm: null,
                showGoogleMaps: true,
                characterImage: 'smirk.png'
            }
        };

        const conversation = conversations[conversationId];
        if (!conversation) {
            console.warn('Unknown conversation ID:', conversationId);
            return conversations['welcome'];
        }
        return conversation;
    };

    const handleGeoClick = () => {
        setShowExplanation(true);
    };

    const handleClose = () => {
        setShowExplanation(false);
        if (pendingConversation) {
            try {
                const content = getConversationContent(pendingConversation);
                if (content && content.unlockAlgorithm && onAlgorithmUnlock) {
                    onAlgorithmUnlock(content.unlockAlgorithm);
                }
                if (content && content.showGoogleMaps && onShowGoogleMaps) {
                    onShowGoogleMaps();
                }
                if (onConversationComplete) {
                    onConversationComplete(pendingConversation);
                }
            } catch (error) {
                console.error('Error in conversation completion:', error, 'Conversation ID:', pendingConversation);
                if (onConversationComplete) {
                    onConversationComplete(pendingConversation);
                }
            }
        }
    };

    return (
        <>
            <Zoom in={!!pendingConversation}>
                <Fab
                    onClick={handleGeoClick}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '20px',
                        zIndex: 1000,
                        backgroundColor: pendingConversation ? '#46B780' : '#666',
                        width: '70px',
                        height: '70px',
                        boxShadow: pendingConversation ? '0 8px 25px rgba(70, 183, 128, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        animation: pendingConversation ? 'pulse 2s infinite' : 'none'
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

            {showExplanation && pendingConversation && (() => {
                try {
                    const content = getConversationContent(pendingConversation);
                    if (!content) return null;
                    
                    return (
                        <GeoIntroduction
                            event={{
                                character: 'geo',
                                characterImage: content.characterImage || 'first.png',
                                dialogue: {
                                    title: content.title || 'Conversation',
                                    message: `${content.explanation || ''}\n\n${content.nextInfo || ''}`,
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
                    );
                } catch (error) {
                    console.error('Error rendering conversation:', error, 'Conversation ID:', pendingConversation);
                    return null;
                }
            })()}
        </>
    );
};

export default GeoButton; 