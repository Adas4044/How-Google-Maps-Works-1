const tutorialEvents = [
    {
        id: 'welcome',
        trigger: 'app_start',
        character: 'geo',
        dialogue: {
            title: "Hi! I'm Geo 🗺️",
            message: "Welcome to an intuitive guide to Google Maps! Let's explore the fascinating algorithms that power the world's most popular navigation app.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: true
    },
    {
        id: 'getting_started',
        trigger: 'dialogue_next',
        character: 'geo',
        dialogue: {
            title: "Let's Get Started! 🚀",
            message: "First, try clicking on the map to set a starting point. You'll see a green marker appear where you click.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Click on the map to continue..."
        },
        position: 'bottom-left',
        backdrop: false,
        waitFor: 'start_point_set'
    },
    {
        id: 'set_destination',
        trigger: 'start_point_set',
        character: 'geo',
        dialogue: {
            title: "Great Job! 🎯",
            message: "Now click somewhere else on the map to set your destination. This will be your red endpoint marker.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Set your destination..."
        },
        position: 'bottom-right',
        backdrop: false,
        waitFor: 'end_point_set'
    },
    {
        id: 'choose_algorithm',
        trigger: 'end_point_set',
        character: 'geo',
        dialogue: {
            title: "Perfect! Now Choose an Algorithm 🧠",
            message: "See those buttons at the bottom? Each one represents a different pathfinding algorithm. Try starting with 'BFS' (Breadth-First Search) - it's a great beginner algorithm!",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-center',
        backdrop: false
    },
    {
        id: 'run_algorithm',
        trigger: 'dialogue_next',
        character: 'geo',
        dialogue: {
            title: "Ready to See the Magic? ✨",
            message: "Click the 'Play' button to watch the algorithm search for the shortest path. You'll see it explore different routes in real-time!",
            hasNext: false,
            autoAdvance: false,
            actionText: "Click Play to run the algorithm..."
        },
        position: 'top-right',
        backdrop: false,
        waitFor: 'algorithm_started'
    },
    {
        id: 'algorithm_complete',
        trigger: 'algorithm_finished',
        character: 'geo',
        dialogue: {
            title: "Amazing Work! 🎉",
            message: "You just witnessed a pathfinding algorithm in action! The red line shows the optimal path it found. Try different algorithms to see how they compare.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },
    {
        id: 'explore_more',
        trigger: 'dialogue_next',
        character: 'geo',
        dialogue: {
            title: "Keep Exploring! 🌟",
            message: "Try different algorithms like A*, Dijkstra, or Bidirectional Search. Each has unique strengths! You can also adjust the map radius in settings. Happy pathfinding!",
            hasNext: false,
            autoAdvance: false,
            isClosing: true
        },
        position: 'center',
        backdrop: false
    }
];

export const getTutorialEvent = (eventId) => {
    return tutorialEvents.find(event => event.id === eventId);
};

export const getEventByTrigger = (trigger) => {
    return tutorialEvents.find(event => event.trigger === trigger);
};

export const getNextEvent = (currentEventId) => {
    const currentIndex = tutorialEvents.findIndex(event => event.id === currentEventId);
    return currentIndex !== -1 && currentIndex < tutorialEvents.length - 1 
        ? tutorialEvents[currentIndex + 1] 
        : null;
};

export const getAllEvents = () => tutorialEvents;

export default tutorialEvents; 