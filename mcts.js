/**
 * Monte Carlo Tree Search Algorithm
 * Author: Kelly Ristovsky
 * Date: Nov-22
 */

class Node {
    contructor (state, playerTurn, action) {
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
        return this.children.length() == 0
    }

    // Create list of children from list of possible actions
    createChildren (getPossibleActions, getNextState) {
        const possibleActions = getPossibleActions(this.state, this.playerTurn)

        for (const action of possibleActions) {
            this.children.push(new Node(getNextState(this.state, this.playerTurn, action), this.playerTurn*-1, action))
        }

        // Choose random possible State and return for the Expansion Phase
        const randomChildIndex = Math.floor(Math.random() * this.children.length)
        return this.children[randomChildIndex]
    }
}

// Calculates the UCB Score for a given Node
function ucbScore(n, s, c, nParent) {
    return (s / n) + c * Math.sqrt((2 * Math.log(nParent) ) / n)
}

function mctsAlgorithm(initialState, playerTurn, numIterations, getPossibleActions, getNextState) {
    // First initialize the root node
    const root = new Node(initialState, playerTurn)

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
                const currentUCBScore = ucbScore()
                if (currentUCBScore > highestUCBScore) {
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
        const selectedExpansionNode = nodeList[nodeList.length-1].createChildren()
        nodeList.push(selectedExpansionNode)
        
        /**
         * SIMULATION PHASE
         */
        
    }

}