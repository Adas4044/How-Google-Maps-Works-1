import { useState, useCallback, useEffect } from 'react';
import { getTutorialEvent, getEventByTrigger, getNextEvent } from '../data/tutorialEvents';

export const useTutorial = () => {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [completedEvents, setCompletedEvents] = useState(new Set());
    const [waitingFor, setWaitingFor] = useState(null);

    const startTutorial = useCallback(() => {
        const firstEvent = getTutorialEvent('welcome');
        setCurrentEvent(firstEvent);
        setIsActive(true);
        setWaitingFor(null);
    }, []);

    const triggerEvent = useCallback((triggerType, data = {}) => {
        if (!isActive) return;

        if (waitingFor && waitingFor === triggerType) {
            setWaitingFor(null);
            const nextEvent = getEventByTrigger(triggerType);
            if (nextEvent) {
                setCurrentEvent(nextEvent);
            }
            return;
        }

        const event = getEventByTrigger(triggerType);
        if (event && !completedEvents.has(event.id)) {
            setCurrentEvent(event);
        }
    }, [isActive, waitingFor, completedEvents]);

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