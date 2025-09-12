import { useState, useCallback, useEffect } from 'react';
import { getTutorialEvent, getEventByTrigger, getNextEvent } from '../data/tutorialEvents';

export const useTutorial = () => {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [completedEvents, setCompletedEvents] = useState(new Set());
    const [waitingFor, setWaitingFor] = useState(null);

    const startTutorial = useCallback(() => {
        setIsActive(true);
        setWaitingFor(null);
        // Trigger the app_start event to properly start the tutorial flow
        setTimeout(() => {
            const firstEvent = getEventByTrigger('app_start');
            if (firstEvent) {
                setCurrentEvent(firstEvent);
            }
        }, 100);
    }, []);

        const triggerEvent = useCallback((triggerType, data = {}) => {
        try {
            if (!isActive) return;

            if (waitingFor && waitingFor === triggerType) {
                // Mark the previous event as completed when its waitFor condition is met
                if (currentEvent) {
                    setCompletedEvents(prev => new Set([...prev, currentEvent.id]));
                }
                setWaitingFor(null);
                setCurrentEvent(null); // Clear current event first
                return;
            }

            const event = getEventByTrigger(triggerType);
            if (event && !completedEvents.has(event.id)) {
                setCurrentEvent(event);
            }
        } catch (error) {
            console.error('Tutorial system error:', error);
            // Disable tutorial on error to prevent blocking core functionality
            setIsActive(false);
            setCurrentEvent(null);
        }
    }, [isActive, waitingFor, completedEvents, currentEvent]);

    const handleNext = useCallback(() => {
        if (!currentEvent) return;

        const nextEvent = getNextEvent(currentEvent.id);
        
        if (nextEvent && nextEvent.trigger === 'dialogue_next') {
            setCurrentEvent(nextEvent);
        } else if (currentEvent.waitFor) {
            setWaitingFor(currentEvent.waitFor);
            setCurrentEvent(null);
        } else {
            setCurrentEvent(null);
        }

        setCompletedEvents(prev => new Set([...prev, currentEvent.id]));
    }, [currentEvent]);

    const handleClose = useCallback(() => {
        if (currentEvent) {
            setCompletedEvents(prev => new Set([...prev, currentEvent.id]));
        }
        setCurrentEvent(null);
        setIsActive(false);
        setWaitingFor(null);
        localStorage.setItem('pathfinding_tutorial_completed', 'true');
    }, [currentEvent]);

    const skipTutorial = useCallback(() => {
        setCurrentEvent(null);
        setIsActive(false);
        setWaitingFor(null);
        localStorage.setItem('pathfinding_tutorial_completed', 'true');
    }, []);

    const resetTutorial = useCallback(() => {
        setCurrentEvent(null);
        setIsActive(false);
        setCompletedEvents(new Set());
        setWaitingFor(null);
        localStorage.removeItem('pathfinding_tutorial_completed');
    }, []);

    useEffect(() => {
        const hasCompletedTutorial = localStorage.getItem('pathfinding_tutorial_completed');
        if (hasCompletedTutorial) {
            setIsActive(false);
        }
    }, []);

    return {
        currentEvent,
        isActive,
        waitingFor,
        startTutorial,
        triggerEvent,
        handleNext,
        handleClose,
        skipTutorial,
        resetTutorial,
        completedEvents: Array.from(completedEvents)
    };
}; 