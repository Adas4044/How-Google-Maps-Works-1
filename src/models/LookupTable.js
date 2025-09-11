export default class LookupTable {
    constructor() {
        this.majorRoutes = new Map();
        this.hubNodes = new Set();
        this.computed = false;
    }

    precompute(graph) {
        this.majorRoutes.clear();
        this.hubNodes.clear();
        
        this.identifyHubNodes(graph);
        this.computeHubToHubPaths(graph);
        
        this.computed = true;
    }

    identifyHubNodes(graph) {
        const connectivityThreshold = 3;
        const distanceThreshold = 0.01;
        
        for (const [nodeId, node] of graph.nodes) {
            if (node.neighbors.length >= connectivityThreshold) {
                const distances = node.neighbors.map(n => 
                    Math.hypot(n.node.longitude - node.longitude, n.node.latitude - node.latitude)
                );
                
                const maxDistance = Math.max(...distances);
                if (maxDistance > distanceThreshold) {
                    this.hubNodes.add(node);
                }
            }
        }
    }

    computeHubToHubPaths(graph) {
        const hubArray = Array.from(this.hubNodes);
        
        for (let i = 0; i < hubArray.length; i++) {
            for (let j = i + 1; j < hubArray.length; j++) {
                const startHub = hubArray[i];
                const endHub = hubArray[j];
                
                const path = this.dijkstraPath(graph, startHub, endHub);
                if (path && path.length > 2) {
                    const key = this.getRouteKey(startHub.id, endHub.id);
                    this.majorRoutes.set(key, {
                        path: path,
                        distance: this.calculatePathDistance(path),
                        startHub: startHub.id,
                        endHub: endHub.id
                    });
                }
            }
        }
    }

    dijkstraPath(graph, startNode, endNode) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        
        for (const [nodeId, node] of graph.nodes) {
            distances.set(nodeId, nodeId === startNode.id ? 0 : Infinity);
            unvisited.add(nodeId);
        }
        
        while (unvisited.size > 0) {
            let currentNodeId = null;
            let minDistance = Infinity;
            
            for (const nodeId of unvisited) {
                if (distances.get(nodeId) < minDistance) {
                    minDistance = distances.get(nodeId);
                    currentNodeId = nodeId;
                }
            }
            
            if (currentNodeId === null || minDistance === Infinity) {
                break;
            }
            
            unvisited.delete(currentNodeId);
            const currentNode = graph.getNode(currentNodeId);
            
            if (currentNodeId === endNode.id) {
                const path = [];
                let current = endNode.id;
                while (current !== undefined) {
                    path.unshift(graph.getNode(current));
                    current = previous.get(current);
                }
                return path;
            }
            
            for (const neighbor of currentNode.neighbors) {
                const neighborId = neighbor.node.id;
                if (!unvisited.has(neighborId)) continue;
                
                const edgeWeight = neighbor.edge.weight;
                const newDistance = distances.get(currentNodeId) + edgeWeight;
                
                if (newDistance < distances.get(neighborId)) {
                    distances.set(neighborId, newDistance);
                    previous.set(neighborId, currentNodeId);
                }
            }
        }
        
        return null;
    }

    calculatePathDistance(path) {
        let distance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            distance += Math.hypot(
                path[i + 1].longitude - path[i].longitude,
                path[i + 1].latitude - path[i].latitude
            );
        }
        return distance;
    }

    getRoute(fromNode, toNode) {
        if (!this.computed) return null;
        
        const fromIsHub = this.hubNodes.has(fromNode);
        const toIsHub = this.hubNodes.has(toNode);
        
        if (!fromIsHub && !toIsHub) return null;
        
        const key = this.getRouteKey(fromNode.id, toNode.id);
        const reverseKey = this.getRouteKey(toNode.id, fromNode.id);
        
        return this.majorRoutes.get(key) || this.majorRoutes.get(reverseKey) || null;
    }

    findNearestHub(node) {
        if (!this.computed || this.hubNodes.size === 0) return null;
        
        let nearestHub = null;
        let minDistance = Infinity;
        
        for (const hub of this.hubNodes) {
            const distance = Math.hypot(
                hub.longitude - node.longitude,
                hub.latitude - node.latitude
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestHub = hub;
            }
        }
        
        return nearestHub;
    }

    getRouteKey(nodeId1, nodeId2) {
        return nodeId1 < nodeId2 ? `${nodeId1}-${nodeId2}` : `${nodeId2}-${nodeId1}`;
    }

    getStats() {
        return {
            computed: this.computed,
            hubNodes: this.hubNodes.size,
            precomputedRoutes: this.majorRoutes.size,
            routes: Array.from(this.majorRoutes.entries()).map(([key, route]) => ({
                key,
                distance: route.distance.toFixed(4),
                pathLength: route.path.length
            }))
        };
    }
} 