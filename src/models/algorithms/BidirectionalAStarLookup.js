import PathfindingAlgorithm from "./PathfindingAlgorithm";
import LookupTable from "../LookupTable";

class BidirectionalAStarLookup extends PathfindingAlgorithm {
    constructor() {
        super();
        this.openSetStart = [];
        this.openSetEnd = [];
        this.closedSetStart = new Set();
        this.closedSetEnd = new Set();
        this.meetingNode = null;
        this.lookupTable = new LookupTable();
        this.usingLookupPath = false;
        this.lookupPath = null;
        this.lookupPathIndex = 0;
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        
        if (!this.lookupTable.computed) {
            const graph = this.getGraphFromNode(startNode);
            if (graph) {
                this.lookupTable.precompute(graph);
            }
        }
        
        const precomputedRoute = this.lookupTable.getRoute(startNode, endNode);
        if (precomputedRoute) {
            this.usingLookupPath = true;
            this.lookupPath = precomputedRoute.path;
            this.lookupPathIndex = 0;
            return;
        }
        
        const startHub = this.lookupTable.findNearestHub(startNode);
        const endHub = this.lookupTable.findNearestHub(endNode);
        
        if (startHub && endHub && startHub !== endHub) {
            const hubRoute = this.lookupTable.getRoute(startHub, endHub);
            if (hubRoute) {
                this.usingLookupPath = true;
                this.lookupPath = [startNode, ...hubRoute.path, endNode];
                this.lookupPathIndex = 0;
                return;
            }
        }
        
        this.openSetStart = [startNode];
        this.openSetEnd = [endNode];
        this.closedSetStart = new Set();
        this.closedSetEnd = new Set();
        this.meetingNode = null;
        this.usingLookupPath = false;
        
        startNode.distanceFromStart = 0;
        startNode.distanceToEnd = this.heuristic(startNode, endNode);
        
        endNode.distanceFromStart = 0;
        endNode.distanceToEnd = this.heuristic(endNode, startNode);
    }

    getGraphFromNode(node) {
        const visited = new Set();
        const nodes = new Map();
        const queue = [node];
        
        let maxNodes = 10000;
        while (queue.length > 0 && maxNodes > 0) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            
            visited.add(current.id);
            nodes.set(current.id, current);
            maxNodes--;
            
            for (const neighbor of current.neighbors) {
                if (!visited.has(neighbor.node.id) && maxNodes > 0) {
                    queue.push(neighbor.node);
                }
            }
        }
        
        return {
            nodes: nodes,
            startNode: node,
            getNode: (id) => nodes.get(id)
        };
    }

    heuristic(nodeA, nodeB) {
        return Math.hypot(nodeA.longitude - nodeB.longitude, nodeA.latitude - nodeB.latitude);
    }

    nextStep() {
        if (this.usingLookupPath && this.lookupPath) {
            if (this.lookupPathIndex >= this.lookupPath.length - 1) {
                this.finished = true;
                return [];
            }
            
            const currentNode = this.lookupPath[this.lookupPathIndex];
            const nextNode = this.lookupPath[this.lookupPathIndex + 1];
            
            if (currentNode && nextNode) {
                currentNode.visited = true;
                nextNode.referer = currentNode;
                nextNode.parent = currentNode;
                
                const edge = currentNode.edges.find(e => e.getOtherNode(currentNode) === nextNode);
                if (edge) {
                    edge.visited = true;
                }
            }
            
            this.lookupPathIndex++;
            
            if (this.lookupPathIndex >= this.lookupPath.length - 1) {
                this.finished = true;
            }
            
            return [nextNode];
        }
        
        if (this.finished || (this.openSetStart.length === 0 && this.openSetEnd.length === 0)) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];

        if (this.openSetStart.length > 0) {
            const currentStart = this.getLowestFScoreNode(this.openSetStart);
            this.openSetStart.splice(this.openSetStart.indexOf(currentStart), 1);
            this.closedSetStart.add(currentStart);
            currentStart.visited = true;

            const refEdge = currentStart.edges.find(e => e.getOtherNode(currentStart) === currentStart.referer);
            if (refEdge) refEdge.visited = true;

            if (this.closedSetEnd.has(currentStart) || this.openSetEnd.includes(currentStart)) {
                this.meetingNode = currentStart;
                this.finished = true;
                return [currentStart];
            }

            updatedNodes.push(currentStart);
            updatedNodes.push(...this.updateNeighbors(currentStart, this.openSetStart, this.closedSetStart, true));
        }

        if (this.openSetEnd.length > 0 && !this.finished) {
            const currentEnd = this.getLowestFScoreNode(this.openSetEnd);
            this.openSetEnd.splice(this.openSetEnd.indexOf(currentEnd), 1);
            this.closedSetEnd.add(currentEnd);
            currentEnd.visited = true;

            const refEdge = currentEnd.edges.find(e => e.getOtherNode(currentEnd) === currentEnd.referer);
            if (refEdge) refEdge.visited = true;

            if (this.closedSetStart.has(currentEnd) || this.openSetStart.includes(currentEnd)) {
                this.meetingNode = currentEnd;
                this.finished = true;
                return [currentEnd];
            }

            updatedNodes.push(currentEnd);
            updatedNodes.push(...this.updateNeighbors(currentEnd, this.openSetEnd, this.closedSetEnd, false));
        }

        return updatedNodes;
    }

    updateNeighbors(currentNode, openSet, closedSet, isStartSide) {
        const updatedNodes = [];
        const targetNode = isStartSide ? this.endNode : this.startNode;

        for (const n of currentNode.neighbors) {
            const neighbor = n.node;
            const edge = n.edge;

            if (closedSet.has(neighbor)) continue;

            let edgeWeight = Math.hypot(neighbor.longitude - currentNode.longitude, neighbor.latitude - currentNode.latitude);
            
            if (this.lookupTable.computed) {
                const lookupRoute = this.lookupTable.getRoute(neighbor, targetNode);
                if (lookupRoute) {
                    edgeWeight = Math.min(edgeWeight, lookupRoute.distance * 0.8);
                }
            }

            const tentativeGScore = currentNode.distanceFromStart + edgeWeight;

            if (neighbor.visited && !edge.visited) {
                edge.visited = true;
                neighbor.referer = currentNode;
                updatedNodes.push(neighbor);
            }

            let isInOpenSet = openSet.includes(neighbor);

            if (!isInOpenSet) {
                openSet.push(neighbor);
                isInOpenSet = true;
            }
            else if (neighbor.distanceFromStart <= tentativeGScore) {
                continue;
            }

            neighbor.distanceFromStart = tentativeGScore;
            neighbor.distanceToEnd = this.heuristic(neighbor, targetNode);
            neighbor.referer = currentNode;
            
            neighbor.prevParent = neighbor.parent;
            neighbor.parent = currentNode;

            if (!updatedNodes.includes(neighbor)) {
                updatedNodes.push(neighbor);
            }
        }

        return updatedNodes;
    }

    getLowestFScoreNode(nodeSet) {
        return nodeSet.reduce((lowest, current) => {
            const currentF = current.distanceFromStart + current.distanceToEnd;
            const lowestF = lowest.distanceFromStart + lowest.distanceToEnd;
            return currentF < lowestF ? current : lowest;
        }, nodeSet[0]);
    }

    getLookupTable() {
        return this.lookupTable;
    }
}

export default BidirectionalAStarLookup; 