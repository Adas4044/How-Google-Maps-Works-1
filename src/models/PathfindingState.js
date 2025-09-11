import AStar from "./algorithms/AStar";
import BidirectionalSearch from "./algorithms/BidirectionalSearch";
import BidirectionalAStar from "./algorithms/BidirectionalA*";
import BidirectionalAStarLookup from "./algorithms/BidirectionalAStarLookup";
import Dijkstra from "./algorithms/Dijkstra";
import Greedy from "./algorithms/Greedy";
import BFS from "./algorithms/BFS";
import DFS from "./algorithms/DFS";
import PathfindingAlgorithm from "./algorithms/PathfindingAlgorithm";

export default class PathfindingState {
    static #instance;

    /**
     * Singleton class
     * @returns {PathfindingState}
     */
    constructor() {
        if (!PathfindingState.#instance) {
            this.endNode = null;
            this.graph = null;
            this.finished = false;
            this.algorithm = new PathfindingAlgorithm();
            PathfindingState.#instance = this;
        }
    
        return PathfindingState.#instance;
    }

    get startNode() {
        return this.graph.startNode;
    }

    /**
     * 
     * @param {Number} id OSM node id
     * @returns {import("./Node").default} node
     */
    getNode(id) {
        return this.graph?.getNode(id);
    }

    /**
     * Resets to default state
     */
    reset() {
        this.finished = false;
        if(!this.graph) return;
        for(const key of this.graph.nodes.keys()) {
            this.graph.nodes.get(key).reset();
        }
    }

    /**
     * Resets state and initializes new pathfinding animation
     */
    start(algorithm, userRadius = 4) {
        this.reset();
        switch(algorithm) {
            case "bfs":
                this.algorithm = new BFS();
                break;
            case "dfs":
                this.algorithm = new DFS();
                break;
            case "astar":
                this.algorithm = new AStar();
                break;
            case "greedy":
                this.algorithm = new Greedy();
                break;
            case "dijkstra":
                this.algorithm = new Dijkstra();
                break;
            case "bidirectional":
                this.algorithm = new BidirectionalSearch();
                break;
            case "bidirectional-astar":
                this.algorithm = new BidirectionalAStar();
                break;
            case "bidirectional-astar-lookup":
                this.algorithm = new BidirectionalAStarLookup();
                break;
            default:
                this.algorithm = new AStar();
                break;
        }

        if (algorithm === "bidirectional-astar-lookup") {
            this.algorithm.start(this.startNode, this.endNode, userRadius);
        } else {
            this.algorithm.start(this.startNode, this.endNode);
        }
    }

    /**
     * Progresses the pathfinding algorithm by one step/iteration
     * @returns {(import("./Node").default)[]} array of nodes that were updated
     */
    nextStep() {
        const updatedNodes = this.algorithm.nextStep();
        if(this.algorithm.finished || updatedNodes.length === 0) {
            this.finished = true;
        }

        return updatedNodes;
    }
}