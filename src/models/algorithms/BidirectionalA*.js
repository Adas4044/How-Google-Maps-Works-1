import PathfindingAlgorithm from "./PathfindingAlgorithm";

class BidirectionalAStar extends PathfindingAlgorithm {
    constructor() {
        super();
        this.openSetStart = [];
        this.openSetEnd = [];
        this.closedSetStart = new Set();
        this.closedSetEnd = new Set();
        this.meetingNode = null;
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.openSetStart = [startNode];
        this.openSetEnd = [endNode];
        this.closedSetStart = new Set();
        this.closedSetEnd = new Set();
        this.meetingNode = null;
        
        // Initialize distances for start node
        startNode.distanceFromStart = 0;
        startNode.distanceToEnd = this.heuristic(startNode, endNode);
        
        // Initialize distances for end node (reversed search)
        endNode.distanceFromStart = 0;
        endNode.distanceToEnd = this.heuristic(endNode, startNode);
    }

    heuristic(nodeA, nodeB) {
        return Math.hypot(nodeA.longitude - nodeB.longitude, nodeA.latitude - nodeB.latitude);
    }

    nextStep() {
        if (this.finished || (this.openSetStart.length === 0 && this.openSetEnd.length === 0)) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];

        // Expand from start side
        if (this.openSetStart.length > 0) {
            const currentStart = this.getLowestFScoreNode(this.openSetStart);
            this.openSetStart.splice(this.openSetStart.indexOf(currentStart), 1);
            this.closedSetStart.add(currentStart);
            currentStart.visited = true;

            const refEdge = currentStart.edges.find(e => e.getOtherNode(currentStart) === currentStart.referer);
            if (refEdge) refEdge.visited = true;

            // Check if we've met the other search
            if (this.closedSetEnd.has(currentStart) || this.openSetEnd.includes(currentStart)) {
                this.meetingNode = currentStart;
                this.finished = true;
                return [currentStart];
            }

            updatedNodes.push(currentStart);
            updatedNodes.push(...this.updateNeighbors(currentStart, this.openSetStart, this.closedSetStart, true));
        }

        // Expand from end side
        if (this.openSetEnd.length > 0 && !this.finished) {
            const currentEnd = this.getLowestFScoreNode(this.openSetEnd);
            this.openSetEnd.splice(this.openSetEnd.indexOf(currentEnd), 1);
            this.closedSetEnd.add(currentEnd);
            currentEnd.visited = true;

            const refEdge = currentEnd.edges.find(e => e.getOtherNode(currentEnd) === currentEnd.referer);
            if (refEdge) refEdge.visited = true;

            // Check if we've met the other search
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

            // Skip if already in closed set
            if (closedSet.has(neighbor)) continue;

            // Calculate tentative g score (distance from start)
            const tentativeGScore = currentNode.distanceFromStart + 
                Math.hypot(neighbor.longitude - currentNode.longitude, neighbor.latitude - currentNode.latitude);

            // Fill edges that are not marked on the map
            if (neighbor.visited && !edge.visited) {
                edge.visited = true;
                neighbor.referer = currentNode;
                updatedNodes.push(neighbor);
            }

            let isInOpenSet = openSet.includes(neighbor);

            // If not in open set, add it
            if (!isInOpenSet) {
                openSet.push(neighbor);
                isInOpenSet = true;
            }
            // If already in open set with a better path, skip
            else if (neighbor.distanceFromStart <= tentativeGScore) {
                continue;
            }

            // This path is the best so far, record it
            neighbor.distanceFromStart = tentativeGScore;
            neighbor.distanceToEnd = this.heuristic(neighbor, targetNode);
            neighbor.referer = currentNode;
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
}

export default BidirectionalAStar;
