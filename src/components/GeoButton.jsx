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
                nextInfo: "First, set two points on the map by clicking, the right clicking. Then we'll start with the most basic algorithm - BFS (Breadth-First Search).",
                unlockAlgorithm: 'bfs'
            },
            'bfs': {
                title: "BFS (Breadth-First Search)",
                explanation: "Let's start with the most basic approach: Breadth-First Search. Imagine dropping a stone in a pond - the ripples expand outward evenly in all directions.",
                nextInfo: "BFS explores every possible path layer by layer. It guarantees the shortest path if all roads have the same cost. Try it now!",
                unlockAlgorithm: 'bfs'
            },
            'dfs': {
                title: "DFS (Depth-First Search)",
                explanation: "Now let's try a completely different approach. What if we just dove deep down one path until we hit a dead end, then backtrack?",
                nextInfo: "DFS is like your uncle driving through a foreign country, taking random turns hoping to find the destination. It can work, but it might take forever!",
                unlockAlgorithm: 'dfs'
            },
            'bidirectional': {
                title: "Bidirectional BFS",
                explanation: "Let's go back to BFS and improve it. What if we start searching from both the start AND the goal? They meet in the middle!",
                nextInfo: "This is like two people walking toward each other instead of one person making the whole trip. Much faster!",
                unlockAlgorithm: 'bidirectional'
            },
            'greedy': {
                title: "Greedy Search",
                explanation: "What if we added some direction? Imagine you're at home and want to go to McDonald's - you already know which way it is, so just head there!",
                nextInfo: "Greedy Search always chooses the path that looks closest to the goal. It's fast and intuitive, but can it handle tricky situations?",
                unlockAlgorithm: 'greedy'
            },
            'astar': {
                title: "A* Search",
                explanation: "Greedy Search has a problem - it can get stuck in loops and find only a locally optimal path, not a most optimal path. That's why most systems use A* - think of it as Greedy Search with a brain!",
                nextInfo: "A* balances two things: how far you've traveled (g) and how far you still need to go (h). Formula: f(n) = g(n) + h(n). Try it!",
                unlockAlgorithm: 'astar'
            },
            'bidirectional-astar': {
                title: "Bidirectional A* ⚡",
                explanation: "We made BFS faster with bidirectional search. Can we do the same for A*? Absolutely! Run A* from both ends simultaneously.",
                nextInfo: "This combines A*'s intelligence with bidirectional speed. It's getting close to what real navigation systems use!",
                unlockAlgorithm: 'bidirectional-astar'
            },
            'bidirectional-astar-lookup': {
                title: "A* + Lookup Table",
                explanation: "How does Google Maps answer so fast? The secret is precomputation! Instead of calculating everything on the fly, it stores shortcuts for major routes.",
                nextInfo: "Highways connect distant places quickly, so precompute those paths and only calculate local roads in real-time. This is how Google Maps really works!",
                unlockAlgorithm: 'bidirectional-astar-lookup'
            },
            'final': {
                title: "Congratulations!",
                explanation: "You've mastered all the core pathfinding algorithms! From basic BFS to advanced A* with lookup tables, you now understand the building blocks of navigation systems.",
                nextInfo: "Ready to see how it all comes together? Let's explore the complete Google Maps system!",
                unlockAlgorithm: null,
                showGoogleMaps: true
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
                                characterImage: 'first.png',
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