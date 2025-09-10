import PathfindingAlgorithm from "./PathfindingAlgorithm";

class DFS extends PathfindingAlgorithm {
    constructor() {
        super();
        this.stack = [];
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.stack = [this.startNode];
        this.startNode.visited = true;
    }

    nextStep() {
        if (this.stack.length === 0) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];
        const currentNode = this.stack.pop();
        currentNode.visited = true;
        const refEdge = currentNode.edges.find(e => e.getOtherNode(currentNode) === currentNode.referer);
        if(refEdge) refEdge.visited = true;

        if (currentNode.id === this.endNode.id) {
            this.stack = [];
            this.finished = true;
            return [currentNode];
        }

        for (const n of currentNode.neighbors) {
            const neighbor = n.node;
            const edge = n.edge;

            if(neighbor.visited && !edge.visited) {
                edge.visited = true;
                neighbor.referer = currentNode;
                updatedNodes.push(neighbor);
            }

            if (neighbor.visited) continue;

            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.referer = currentNode;
            this.stack.push(neighbor);
        }

        return [...updatedNodes, currentNode];
    }
}

export default DFS;
