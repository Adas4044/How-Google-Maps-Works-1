import { useState, useEffect, useCallback } from 'react';

const ALGORITHM_ORDER = ['bfs', 'dfs', 'bidirectional', 'greedy', 'astar', 'bidirectional-astar', 'bidirectional-astar-lookup'];

export const useAlgorithmUnlock = () => {
    const [unlockedAlgorithms, setUnlockedAlgorithms] = useState(new Set(['bfs'])); // Start with BFS unlocked
    const [completedAlgorithms, setCompletedAlgorithms] = useState(new Set());
    const [completedConversations, setCompletedConversations] = useState(new Set());
    const [pendingConversation, setPendingConversation] = useState('welcome'); // Start with welcome




    const saveProgress = useCallback((unlocked, completed, conversations) => {
        try {
            localStorage.setItem('pathfinding_unlocked_algorithms', JSON.stringify([...unlocked]));
            localStorage.setItem('pathfinding_completed_algorithms', JSON.stringify([...completed]));
            if (conversations) {
                localStorage.setItem('pathfinding_completed_conversations', JSON.stringify([...conversations]));
            }
        } catch (error) {
            console.warn('Failed to save algorithm progress:', error);
        }
    }, []);

    const unlockAlgorithm = useCallback((algorithmId) => {
        setUnlockedAlgorithms(prev => {
            const newUnlocked = new Set([...prev, algorithmId]);
            saveProgress(newUnlocked, completedAlgorithms, completedConversations);
            return newUnlocked;
        });
    }, [completedAlgorithms, completedConversations, saveProgress]);

    const markAlgorithmCompleted = useCallback((algorithmId) => {
        setCompletedAlgorithms(prev => {
            const newCompleted = new Set([...prev, algorithmId]);
            saveProgress(unlockedAlgorithms, newCompleted, completedConversations);
            return newCompleted;
        });

        const algorithmTransitions = {
            'bfs': 'dfs',
            'dfs': 'bidirectional',
            'bidirectional': 'greedy',
            'greedy': 'astar',
            'astar': 'bidirectional-astar',
            'bidirectional-astar': 'bidirectional-astar-lookup'
        };

        const nextAlgorithm = algorithmTransitions[algorithmId];
        if (nextAlgorithm) {
            setPendingConversation(nextAlgorithm);
        } else if (algorithmId === 'bidirectional-astar-lookup') {
            setPendingConversation('final');
            unlockAlgorithm('google-maps');
        }
    }, [unlockedAlgorithms, completedConversations, saveProgress, unlockAlgorithm]);

    const completeConversation = useCallback((conversationId) => {
        try {
            if (!conversationId) {
                return;
            }

            setCompletedConversations(prev => {
                const newCompleted = new Set([...prev, conversationId]);
                saveProgress(unlockedAlgorithms, completedAlgorithms, newCompleted);
                return newCompleted;
            });
            setPendingConversation(null);
            
            const conversationUnlocks = {
                'welcome': null, // Welcome should trigger BFS conversation, not unlock BFS directly
                'bfs': 'bfs',
                'dfs': 'dfs',
                'bidirectional': 'bidirectional',
                'greedy': 'greedy',
                'astar': 'astar',
                'bidirectional-astar': 'bidirectional-astar',
                'bidirectional-astar-lookup': 'bidirectional-astar-lookup'
            };

            const algorithmToUnlock = conversationUnlocks[conversationId];
            if (algorithmToUnlock) {
                unlockAlgorithm(algorithmToUnlock);
            }
            
            // Welcome conversation now handles BFS as a second panel, no need for separate BFS conversation
        } catch (error) {
            console.error('Error in completeConversation:', error, 'conversationId:', conversationId);
            setPendingConversation(null);
        }
    }, [unlockedAlgorithms, completedAlgorithms, saveProgress, unlockAlgorithm]);

    const handleAlgorithmClick = useCallback((algorithmId) => {
        try {
            if (!algorithmId) {
                console.warn('handleAlgorithmClick called with no algorithmId');
                return;
            }

            // Only allow conversations for algorithms that aren't part of the main educational flow
            // The main flow algorithms (bfs, dfs, bidirectional, greedy, astar, bidirectional-astar, bidirectional-astar-lookup) 
            // should only show conversations during the educational sequence, not when clicked
            const clickableConversationAlgorithms = ['google-maps'];
            
            if (clickableConversationAlgorithms.includes(algorithmId) && unlockedAlgorithms.has(algorithmId)) {
                setPendingConversation(algorithmId);
            }
        } catch (error) {
            console.error('Error in handleAlgorithmClick:', error, 'algorithmId:', algorithmId);
        }
    }, [unlockedAlgorithms]);

    const resetProgress = useCallback(() => {
        setUnlockedAlgorithms(new Set(['bfs'])); // Always keep BFS unlocked
        setCompletedAlgorithms(new Set());
        setCompletedConversations(new Set());
        setPendingConversation('welcome');
        localStorage.removeItem('pathfinding_unlocked_algorithms');
        localStorage.removeItem('pathfinding_completed_algorithms');
        localStorage.removeItem('pathfinding_completed_conversations');
    }, []);

    const unlockAllAlgorithms = useCallback(() => {
        const allAlgorithms = new Set(ALGORITHM_ORDER);
        const allConversations = new Set(['welcome', ...ALGORITHM_ORDER]);
        setUnlockedAlgorithms(allAlgorithms);
        setCompletedConversations(allConversations);
        setPendingConversation(null);
        saveProgress(allAlgorithms, completedAlgorithms, allConversations);
    }, [completedAlgorithms, saveProgress]);

    const isAlgorithmUnlocked = useCallback((algorithmId) => {
        return unlockedAlgorithms.has(algorithmId);
    }, [unlockedAlgorithms]);

    const isAlgorithmCompleted = useCallback((algorithmId) => {
        return completedAlgorithms.has(algorithmId);
    }, [completedAlgorithms]);



    return {
        unlockedAlgorithms: Array.from(unlockedAlgorithms),
        completedAlgorithms: Array.from(completedAlgorithms),
        completedConversations: Array.from(completedConversations),
        pendingConversation,
        unlockAlgorithm,
        markAlgorithmCompleted,
        completeConversation,
        handleAlgorithmClick,
        isAlgorithmUnlocked,
        isAlgorithmCompleted,
        resetProgress,
        unlockAllAlgorithms
    };
}; 