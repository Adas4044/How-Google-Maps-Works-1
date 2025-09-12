const tutorialEvents = [
    // Scene 1: Welcome
    {
        id: 'welcome',
        trigger: 'app_start',
        character: 'geo',
        characterImage: 'first.png',
        dialogue: {
            title: "Hi, I'm Geo! 🗺️",
            message: "Today we're going to uncover how Google Maps actually figures out the fastest way to get from point A to point B. First, try picking 2 points decently far from each other on the map.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Click two points on the map to continue..."
        },
        position: 'center',
        backdrop: true,
        waitFor: 'both_points_set'
    },
    
    // Scene 2: The Goal
    {
        id: 'the_goal',
        trigger: 'both_points_set',
        character: 'geo',
        characterImage: 'second.png',
        dialogue: {
            title: "The Goal 🎯",
            message: "The goal of any routing system is simple: find the most efficient path between two points. But the how is where it gets interesting.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },

    // Scene 3: BFS Introduction & Guide to Start
    {
        id: 'bfs_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'third.png',
        dialogue: {
            title: "BFS (Breadth-First Search) 🌊",
            message: "Let's start with the most basic approach: brute force. Or in this case, Breadth-First Search. Notice that BFS is already selected at the bottom. Click the Play button to start the algorithm and watch it work!",
            hasNext: false,
            autoAdvance: false,
            actionText: "Click the Play button to start BFS!"
        },
        position: 'bottom-left',
        backdrop: false,
        waitFor: 'algorithm_started'
    },

    // Scene 3.5: BFS Running Explanation
    {
        id: 'bfs_running',
        trigger: 'algorithm_running_5s',
        character: 'geo',
        characterImage: 'fourth.png',
        dialogue: {
            title: "Watch BFS in Action! 👀",
            message: "Perfect! Now watch as BFS expands outward like ripples in a pond. It explores every possible path layer by layer, checking all neighbors at distance 1, then distance 2, and so on. We keep track of where we've been to avoid going in circles.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-right',
        backdrop: false
    },

    // Scene 4: BFS Complete & Analysis
    {
        id: 'bfs_complete',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'fifth.png',
        dialogue: {
            title: "BFS Analysis 📊",
            message: "BFS guarantees finding the shortest path if all roads were the same length. But notice how it had to explore in all directions - that's a lot of work! The algorithm treats every road equally, even ones going away from our destination.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },

    // Scene 4.5: BFS Drawback
    {
        id: 'bfs_drawback',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'sixth.png',
        dialogue: {
            title: "BFS Drawback ⚠️",
            message: "The catch? BFS can be really slow because it explores everything in that ripple, even paths we don't care about. And in the real world, roads aren't all the same length.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-center',
        backdrop: false
    },

    // Scene 5: DFS Introduction
    {
        id: 'dfs_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'seventh.png',
        dialogue: {
            title: "DFS (Depth-First Search) 🕳️",
            message: "Now, what if we just dove deep down one road until we (hopefully) hit the destination? That's Depth-First Search, or DFS.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-right',
        backdrop: false
    },

    // Scene 6: DFS Analogy
    {
        id: 'dfs_analogy',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'eighth.png',
        dialogue: {
            title: "DFS Problem 🚗",
            message: "But here's the problem: DFS is like your uncle driving through a foreign country, taking random turns hoping to eventually find the hotel. Because roads connect across continents, DFS could waste hours—or centuries—exploring the wrong path.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'bottom-right',
        backdrop: false
    },

    // Scene 7: Bidirectional BFS
    {
        id: 'bidirectional_bfs_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'ninth.png',
        dialogue: {
            title: "Bidirectional BFS 🔄",
            message: "So let's go back to BFS and improve it. What if we start searching from both the start and the goal? That way, they meet in the middle. Select 'Bidirectional BFS' from the algorithm buttons and click Play!",
            hasNext: false,
            autoAdvance: false,
            actionText: "Try Bidirectional BFS algorithm!"
        },
        position: 'bottom-left',
        backdrop: false,
        waitFor: 'algorithm_started'
    },

    // Scene 7.5: Bidirectional BFS Running
    {
        id: 'bidirectional_bfs_running',
        trigger: 'algorithm_running_5s',
        character: 'geo',
        characterImage: 'tenth.png',
        dialogue: {
            title: "Two Ripples Meeting! 🌊🌊",
            message: "Perfect! Now you can see two search areas expanding - one from the start (green) and one from the goal (red). They'll meet somewhere in the middle, which is much faster than searching from just one end!",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-center',
        backdrop: false
    },

    // Scene 8: Visualizing the Speedup
    {
        id: 'speedup_explanation',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'eleventh.png',
        dialogue: {
            title: "Visualizing the Speedup ⚡",
            message: "This is faster because instead of one giant ripple, you get two smaller ones that meet. It's like two people walking toward each other instead of one person making the whole trip.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },

    // Scene 10: Efficiency
    {
        id: 'efficiency',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'twelfth.png',
        dialogue: {
            title: "Efficiency 📊",
            message: "By doing this, we cut down on how many roads we explore. Less work, same answer.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-center',
        backdrop: false
    },

    // Scene 11: Greedy Search
    {
        id: 'greedy_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'thirteenth.png',
        dialogue: {
            title: "Greedy Search 🍟",
            message: "But what if we added some direction? Imagine you're at home and want to go to McDonald's—you already know which way it is, so you just start heading there. That's Greedy Search.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Try Greedy Search algorithm!"
        },
        position: 'bottom-right',
        backdrop: false,
        waitFor: 'greedy_completed'
    },

    // Scene 12: Greedy Strengths
    {
        id: 'greedy_strengths',
        trigger: 'greedy_completed',
        character: 'geo',
        characterImage: 'fourteenth.png',
        dialogue: {
            title: "Greedy Strengths 💪",
            message: "Greedy works by always choosing the road that looks closest to the goal. It's fast, and sometimes it works great.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-left',
        backdrop: false
    },

    // Scene 13: Greedy Weakness
    {
        id: 'greedy_weakness',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'fifteenth.png',
        dialogue: {
            title: "Greedy Weakness ⚠️",
            message: "But it can get stuck in loops. Imagine always following a sign that looks closer, but actually just sends you around in circles.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'top-right',
        backdrop: false
    },

    // Scene 14: A* Search
    {
        id: 'astar_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'sixteenth.png',
        dialogue: {
            title: "A* Search 🧠",
            message: "That's why most systems prefer A*. Think of A* as Greedy Search with a brain—it's willing to backtrack if a path looks bad in the long run.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Try A* algorithm!"
        },
        position: 'bottom-left',
        backdrop: false,
        waitFor: 'astar_completed'
    },

    // Scene 14.5: How A* Works
    {
        id: 'astar_technical',
        trigger: 'astar_completed',
        character: 'geo',
        characterImage: 'seventeenth.png',
        dialogue: {
            title: "How A* Works (Technical) 🔬",
            message: "Let's peek under the hood. A* uses: f(n) = g(n) + h(n). g(n) is cost to reach this point, h(n) is guess of distance to goal, f(n) is total score. Lower score = higher priority, like airport boarding groups!",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },

    // Scene 15: Bidirectional A*
    {
        id: 'bidirectional_astar_intro',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'eighteenth.png',
        dialogue: {
            title: "Bidirectional A* ⚡",
            message: "And yes—we can make A* even faster by running it from both ends.",
            hasNext: false,
            autoAdvance: false,
            actionText: "Try Bidirectional A* algorithm!"
        },
        position: 'bottom-right',
        backdrop: false,
        waitFor: 'bidirectional_astar_completed'
    },

    // Scene 16: Precomputation
    {
        id: 'precomputation',
        trigger: 'bidirectional_astar_completed',
        character: 'geo',
        characterImage: 'nineteenth.png',
        dialogue: {
            title: "Precomputation (Highways Trick) 🛣️",
            message: "But how does Google Maps answer so fast in real life? The secret is precomputation. Instead of calculating everything on the fly, it stores shortcuts for big, commonly used routes. Which ones? Highways, of course!",
            hasNext: false,
            autoAdvance: false,
            actionText: "Try A* with precomputed highway shortcuts!"
        },
        position: 'top-center',
        backdrop: false,
        waitFor: 'lookup_completed'
    },

    // Scene 17: Real-World Google Maps
    {
        id: 'real_world',
        trigger: 'lookup_completed',
        character: 'geo',
        characterImage: 'twentieth.png',
        dialogue: {
            title: "Real-World Google Maps 🌍",
            message: "And that's basically how Google Maps works. On top of these algorithms, it also layers real-world data—like traffic, accidents, and weather—to adjust your route dynamically.",
            hasNext: true,
            autoAdvance: false
        },
        position: 'center',
        backdrop: false
    },

    // Scene 18: Credits
    {
        id: 'credits',
        trigger: 'dialogue_next',
        character: 'geo',
        characterImage: 'twentyfirst.png',
        dialogue: {
            title: "Credits & Thanks! 🙏",
            message: "Special thanks to the original creator of this pathfinding visualization tool. I tinkered with building my own version but ended up using this one for its simplicity and educational value. Thanks for exploring algorithms with me!",
            hasNext: false,
            autoAdvance: false,
            isClosing: true
        },
        position: 'center',
        backdrop: true
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