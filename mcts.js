/**
 * Monte Carlo Tree Search Algorithm
 * Author: Kelly Ristovsky
 * Date: Nov-22
 * Purpose: - This code is designed to be adaptable for any game.
 */

/**
 * CONSTANTS
 */
const explorationFactor = 0.7

/**
 * Stores game State information for the Search Tree
 */
class Node {

    constructor(state, playerTurn, action) {

        // Action taken on previous state to attain this state
        this.action = action
        this.state = state
        this.playerTurn = playerTurn
        this.children = []

        // For calculating the UCB Score
        this.n = 0
        this.s = 0
    }

    // Checks if the Node is a leaf node (no children)
    isLeaf() {
        return (this.children.length == 0)
    }

    // Create list of children from list of possible actions
    createChildren(getPossibleActions, getNextState) {

        const possibleActions = getPossibleActions(this.state, this.playerTurn)


        for (const action of possibleActions) {
            this.children.push(new Node(getNextState(this.state, this.playerTurn, action), this.playerTurn * -1, action))
        }
        // Choose random possible State and return for the Expansion Phase
        const randomChildIndex = Math.floor(Math.random() * this.children.length)

        return this.children[randomChildIndex]
    }
}

/**
 * Returns the UCB Score for a given Node
 * @param {Number} n 
 * @param {Number} s 
 * @param {Number} c 
 * @param {Number} nParent 
 * @returns {Number}
 */
function ucbScore(n, s, c, nParent) {
    return (s / n) + c * Math.sqrt((2 * Math.log(nParent)) / n)
}

/**
 * Returns the best action choosen from the MCTS
 * @param {Array} initialState 
 * @param {Number} initialPlayerTurn 
 * @param {Number} numIterations 
 * @param {Function} getPossibleActions 
 * @param {Function} getNextState 
 * @param {Array} previousStates 
 * @param {Function} checkTerminal 
 * @param {Function} checkGain 
 * @returns {Array}
 */
function mctsAlgorithm(initialState, initialPlayerTurn, numIterations, getPossibleActions, getNextState, previousStates, checkTerminal, checkGain) {
    
    // First initialize the root node
    let root = new Node(initialState, initialPlayerTurn, false)

    for (let i = 0; i < numIterations; i++) {

        /**
         * SELECTION PHASE
         */
        let currentNode = root
        // List of nodes selected for backpropagation
        const nodeList = [currentNode]

        // Find the node with the highest UCB Score
        while (!currentNode.isLeaf()) {
            let highestUCBScore = 0
            let highestUCBScoreChildIndex = -1

            // Iterate through the children nodes, and calculate there UCB Scores
            for (const [index, child] of currentNode.children.entries()) {
                /**
                 * If no simulations have been run on this node, the n = 0 and UCB = inf. 
                 * Therefore this child is automatically selected (first-come)
                 */
                if (child.n == 0) {
                    highestUCBScoreChildIndex = index
                    break
                }

                /**
                 * If the UCB Score is currently the highest, save the Child index position and the UCB score
                 */
                const currentUCBScore = ucbScore(child.n, child.s, explorationFactor, currentNode.n)

                if (currentUCBScore >= highestUCBScore) {
                    highestUCBScore = currentUCBScore
                    highestUCBScoreChildIndex = index
                }
            }

            // Set the currentNode to be the Node found with the highest UCB Score
            currentNode = currentNode.children[highestUCBScoreChildIndex]
            nodeList.push(currentNode)
        }

        /**
         * EXPANSION PHASE
         */
        // Create children for the node
        const selectedExpansionNode = nodeList[nodeList.length - 1].createChildren(getPossibleActions, getNextState)
        if (selectedExpansionNode) {
            nodeList.push(selectedExpansionNode)
        }

        /**
         * If the Node has no children, then the terminal state is reached,
         * We can skip the simulation phase and go to the BACKPROPAGATION PHASE
         */
        else {
            const gain = checkGain(nodeList[nodeList.length - 1].state, root.playerTurn, previousStates)

            // For every node from the root to the selected node (from the SELECTION PHASE), update n & s values
            for (const node of nodeList) {
                node.n += 1
                node.s += gain
            }
            continue
        }


        /**
         * SIMULATION PHASE
         */
        currentNode = selectedExpansionNode
        // Check if the current State is terminal, else keep simulating the game
        while (!checkTerminal(currentNode.state, currentNode.playerTurn, previousStates)) {
            // Get a list of possible actions from the current State
            const possibleActions = getPossibleActions(currentNode.state, currentNode.playerTurn)

            // Choose a completely random action and create next State from this action
            const randomActionIndex = Math.floor(Math.random() * possibleActions.length)

            currentNode = new Node(getNextState(currentNode.state, currentNode.playerTurn, possibleActions[randomActionIndex]), currentNode.playerTurn * -1, possibleActions[randomActionIndex])
        }

        /**
         * BACKPROPAGATION PHASE
         */
        // Get the Gain value from the SIMULATION PHASE
        const gain = checkGain(currentNode.state, root.playerTurn, previousStates)


        // For every node from the root to the selected node (from the SELECTION PHASE), update n & s values
        for (const node of nodeList) {
            node.n += 1
            node.s += gain
        }
    }

    // Now select the node with the highest n value from the Root children
    let currentHighestN = 0
    let currentBestAction
    for (const child of root.children) {

        if (currentHighestN < child.n) {
            currentHighestN = child.n
            currentBestAction = child.action
        }
    }

    return currentBestAction
}

/**
 * Chooses a random action from a given array. Used in testing for an Random AI
 * @param {Array} actions 
 * @returns 
 */
function chooseRandomAction(actions) {
    const randomIndex = Math.floor(Math.random() * actions.length)
    return actions[randomIndex]
}

module.exports = {mctsAlgorithm, chooseRandomAction}


