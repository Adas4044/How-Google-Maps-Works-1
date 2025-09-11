export default class LookupTable {
    constructor() {
        this.majorRoutes = new Map();
        this.hubNodes = new Set();
        this.computed = false;
    }

    precompute(graph, userRadius = 4) {
        this.majorRoutes.clear();
        this.hubNodes.clear();
        
        this.generateMockLookupTable(graph, userRadius);
        
        this.computed = true;
    }

    generateMockLookupTable(graph, userRadius) {
        const allNodes = Array.from(graph.nodes.values());
        if (allNodes.length < 4) return;

        const numHubs = Math.min(Math.max(3, Math.floor(userRadius)), 8);
        const numRoutes = Math.min(Math.max(2, Math.floor(userRadius * 1.5)), 12);
        
        for (let i = 0; i < numHubs && i < allNodes.length; i++) {
            const randomIndex = Math.floor(Math.random() * allNodes.length);
            this.hubNodes.add(allNodes[randomIndex]);
        }

        const hubArray = Array.from(this.hubNodes);
        for (let i = 0; i < numRoutes; i++) {
            const hub1 = hubArray[Math.floor(Math.random() * hubArray.length)];
            const hub2 = hubArray[Math.floor(Math.random() * hubArray.length)];
            
            if (hub1 === hub2) continue;
            
            const key = this.getRouteKey(hub1.id, hub2.id);
            if (this.majorRoutes.has(key)) continue;
            
            const mockDistance = (0.001 + Math.random() * 0.02) * userRadius;
            const mockPathLength = Math.floor(3 + Math.random() * 15);
            
            this.majorRoutes.set(key, {
                path: [hub1, hub2],
                distance: mockDistance,
                startHub: hub1.id,
                endHub: hub2.id,
                pathLength: mockPathLength
            });
        }
    }

    getRoute(fromNode, toNode) {
        if (!this.computed) return null;
        
        const isFromHub = this.hubNodes.has(fromNode);
        const isToHub = this.hubNodes.has(toNode);
        
        if (Math.random() < 0.3 && (isFromHub || isToHub)) {
            const mockDistance = 0.001 + Math.random() * 0.01;
            return {
                path: [fromNode, toNode],
                distance: mockDistance,
                startHub: fromNode.id,
                endHub: toNode.id
            };
        }
        
        const key = this.getRouteKey(fromNode.id, toNode.id);
        const reverseKey = this.getRouteKey(toNode.id, fromNode.id);
        
        return this.majorRoutes.get(key) || this.majorRoutes.get(reverseKey) || null;
    }

    findNearestHub(node) {
        if (!this.computed || this.hubNodes.size === 0) return null;
        
        const hubArray = Array.from(this.hubNodes);
        return hubArray[Math.floor(Math.random() * hubArray.length)];
    }

    getRouteKey(nodeId1, nodeId2) {
        return nodeId1 < nodeId2 ? `${nodeId1}-${nodeId2}` : `${nodeId2}-${nodeId1}`;
    }

    getStats() {
        const mockRoutes = Array.from(this.majorRoutes.entries()).map(([key, route], index) => ({
            key: `Route-${index + 1}`,
            distance: route.distance.toFixed(4),
            pathLength: route.pathLength || route.path.length
        }));

        return {
            computed: this.computed,
            hubNodes: this.hubNodes.size,
            precomputedRoutes: this.majorRoutes.size,
            routes: mockRoutes
        };
    }
} 