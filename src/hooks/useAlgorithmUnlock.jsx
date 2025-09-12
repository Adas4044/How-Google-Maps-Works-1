import { useState, useEffect, useCallback } from 'react';

const ALGORITHM_ORDER = ['bfs', 'dfs', 'bidirectional', 'greedy', 'astar', 'bidirectional-astar', 'bidirectional-astar-lookup'];

export const useAlgorithmUnlock = () => {
    const [unlockedAlgorithms, setUnlockedAlgorithms] = useState(new Set(['bfs'])); // Start with only BFS
    const [completedAlgorithms, setCompletedAlgorithms] = useState(new Set());

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
        } catch (error) {
            console.warn('Failed to load algorithm progress:', error);
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = useCallback((unlocked, completed) => {
        try {
            localStorage.setItem('pathfinding_unlocked_algorithms', JSON.stringify([...unlocked]));
            localStorage.setItem('pathfinding_completed_algorithms', JSON.stringify([...completed]));
        } catch (error) {
            console.warn('Failed to save algorithm progress:', error);
        }
    }, []);

    const unlockAlgorithm = useCallback((algorithmId) => {
        setUnlockedAlgorithms(prev => {
            const newUnlocked = new Set([...prev, algorithmId]);
            saveProgress(newUnlocked, completedAlgorithms);
            return newUnlocked;
        });
    }, [completedAlgorithms, saveProgress]);

    const markAlgorithmCompleted = useCallback((algorithmId) => {
        setCompletedAlgorithms(prev => {
            const newCompleted = new Set([...prev, algorithmId]);
            saveProgress(unlockedAlgorithms, newCompleted);
            return newCompleted;
        });

        // Auto-unlock next algorithm when current one is completed
        const currentIndex = ALGORITHM_ORDER.indexOf(algorithmId);
        if (currentIndex >= 0 && currentIndex < ALGORITHM_ORDER.length - 1) {
            const nextAlgorithm = ALGORITHM_ORDER[currentIndex + 1];
            unlockAlgorithm(nextAlgorithm);
        }
    }, [unlockedAlgorithms, saveProgress, unlockAlgorithm]);

    const resetProgress = useCallback(() => {
        setUnlockedAlgorithms(new Set(['bfs']));
        setCompletedAlgorithms(new Set());
        localStorage.removeItem('pathfinding_unlocked_algorithms');
        localStorage.removeItem('pathfinding_completed_algorithms');
    }, []);

    const unlockAllAlgorithms = useCallback(() => {
        const allAlgorithms = new Set(ALGORITHM_ORDER);
        setUnlockedAlgorithms(allAlgorithms);
        saveProgress(allAlgorithms, completedAlgorithms);
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
        unlockAlgorithm,
        markAlgorithmCompleted,
        isAlgorithmUnlocked,
        isAlgorithmCompleted,
        resetProgress,
        unlockAllAlgorithms
    };
}; 