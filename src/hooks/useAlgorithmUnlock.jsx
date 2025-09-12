import { useState, useEffect, useCallback } from 'react';

const ALGORITHM_ORDER = ['bfs', 'dfs', 'bidirectional', 'greedy', 'astar', 'bidirectional-astar', 'bidirectional-astar-lookup'];

export const useAlgorithmUnlock = () => {
    const [unlockedAlgorithms, setUnlockedAlgorithms] = useState(new Set()); // Start with no algorithms
    const [completedAlgorithms, setCompletedAlgorithms] = useState(new Set());
    const [completedConversations, setCompletedConversations] = useState(new Set());
    const [pendingConversation, setPendingConversation] = useState('welcome'); // Start with welcome

    // Load saved progress from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('pathfinding_unlocked_algorithms');
            if (saved) {
                setUnlockedAlgorithms(new Set(JSON.parse(saved)));
            }
            
            const completed = localStorage.getItem('pathfinding_completed_algorithms');
            if (completed) {
                setCompletedAlgorithms(new Set(JSON.parse(completed)));
            }

            const conversations = localStorage.getItem('pathfinding_completed_conversations');
            if (conversations) {
                setCompletedConversations(new Set(JSON.parse(conversations)));
                // If welcome conversation is completed, no pending conversation
                const conversationsSet = new Set(JSON.parse(conversations));
                if (conversationsSet.has('welcome')) {
                    setPendingConversation(null);
                }
            }
        } catch (error) {
            console.warn('Failed to load algorithm progress:', error);
        }
    }, []);

    // Save progress to localStorage
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
        console.log('🔓 unlockAlgorithm called with:', algorithmId);
        
        setUnlockedAlgorithms(prev => {
            const newUnlocked = new Set([...prev, algorithmId]);
            console.log('🔓 New unlocked algorithms:', Array.from(newUnlocked));
            saveProgress(newUnlocked, completedAlgorithms, completedConversations);
            return newUnlocked;
        });
    }, [completedAlgorithms, completedConversations, saveProgress]);

    const markAlgorithmCompleted = useCallback((algorithmId) => {
        console.log('🎯 markAlgorithmCompleted called with:', algorithmId);
        
        setCompletedAlgorithms(prev => {
            const newCompleted = new Set([...prev, algorithmId]);
            saveProgress(unlockedAlgorithms, newCompleted, completedConversations);
            return newCompleted;
        });

        // For now, only handle BFS → DFS transition
        if (algorithmId === 'bfs') {
            console.log('🔄 BFS completed, setting DFS conversation as pending');
            setPendingConversation('dfs');
        }
        
        // TODO: Add other algorithm transitions later
        // const currentIndex = ALGORITHM_ORDER.indexOf(algorithmId);
        // if (currentIndex >= 0 && currentIndex < ALGORITHM_ORDER.length - 1) {
        //     const nextAlgorithm = ALGORITHM_ORDER[currentIndex + 1];
        //     setPendingConversation(nextAlgorithm);
        // }
    }, [unlockedAlgorithms, completedConversations, saveProgress]);

    const completeConversation = useCallback((conversationId) => {
        console.log('💬 completeConversation called with:', conversationId);
        
        setCompletedConversations(prev => {
            const newCompleted = new Set([...prev, conversationId]);
            saveProgress(unlockedAlgorithms, completedAlgorithms, newCompleted);
            return newCompleted;
        });
        setPendingConversation(null);
        
        // Unlock the algorithm after its conversation is completed
        if (conversationId === 'welcome') {
            console.log('🎬 Welcome conversation completed, unlocking BFS');
            unlockAlgorithm('bfs');
        } else if (conversationId === 'dfs') {
            console.log('🚀 DFS conversation completed, unlocking DFS');
            unlockAlgorithm('dfs');
        }
        // TODO: Add other algorithm unlocks later
    }, [unlockedAlgorithms, completedAlgorithms, saveProgress, unlockAlgorithm]);

    const handleAlgorithmClick = useCallback((algorithmId) => {
        // For now, only handle BFS and DFS conversations
        if (algorithmId === 'bfs' || algorithmId === 'dfs') {
            setPendingConversation(algorithmId);
        }
        // TODO: Add other algorithm conversations later
    }, []);

    const resetProgress = useCallback(() => {
        setUnlockedAlgorithms(new Set());
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

    // Debug logging
    useEffect(() => {
        console.log('📊 Algorithm state update:', {
            unlockedAlgorithms: Array.from(unlockedAlgorithms),
            completedAlgorithms: Array.from(completedAlgorithms),
            completedConversations: Array.from(completedConversations),
            pendingConversation
        });
    }, [unlockedAlgorithms, completedAlgorithms, completedConversations, pendingConversation]);

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