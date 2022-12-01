/**
 * Monte Carlo Tree Search Algorithm
 * Author: Kelly Ristovsky
 * Date: Nov-22
 * Purpose: This code is designed to be adaptable for any game.
 */


/**
 * Stores game State information
 */
class Node {
    contructor(state, playerTurn, action) {
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

// Calculates the UCB Score for a given Node
function ucbScore(n, s, c, nParent) {
    return (s / n) + c * Math.sqrt((2 * Math.log(nParent)) / n)
}

function mctsAlgorithm(initialState, playerTurn, numIterations, getPossibleActions, getNextState, previousStates, checkTerminal, checkGain) {
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
        const selectedExpansionNode = nodeList[nodeList.length - 1].createChildren(getPossibleActions, getNextState)
        nodeList.push(selectedExpansionNode)


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
            currentNode = new Node(getNextState(currentNode.state, currentNode.playerTurn, possibleActions[randomActionIndex]), this.playerTurn * -1, possibleActions[randomActionIndex])
        }

        /**
         * BACKPROPAGATION PHASE
         */
        // Get the Gain value from the SIMULATION PHASE
        const gain = checkGain(currentNode.state, currentNode.playerTurn, previousStates)

        // For every node from the root to the selected node (from the SELECTION PHASE), update n & s values
        for (const node of nodeList) {
            node.n += 1
            node.s += gain
        }
    }
}

/**
 * CONNECT 4 GAME
 */

const initialState = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', 'X'],
    ['-', '-', '-', 'X', 'X', 'O', 'X'],
    ['-', '-', '-', '-', 'O', '-', '-'],
    ['-', '-', '-', 'X', '-', 'X', 'X'],
    ['-', '-', 'O', '-', '-', '-', 'X']
]

function c4PrintState(state) {
    for (let i = 0; i < 6; i++) {
        console.log(`${state[i][0]} ${state[i][1]} ${state[i][2]} ${state[i][3]} ${state[i][4]} ${state[i][5]} ${state[i][6]}`)
    }
}


function c4getPossibleActions(state, playerTurn) {
    const possibleActions = []
    for (let i = 0; i < 7; i++) {
        for (let j = 5; j >= 0; j--) {
            if (state[j][i] == '-') {
                possibleActions.push({
                    row: j,
                    col: i
                })
                break
            }
        }
    }
    return possibleActions
}

function c4GetNextState(state, playerTurn, action) {

    if (playerTurn == 1) {
        state[action.row][action.col] = 'X'
    }
    if (playerTurn == -1) {
        state[action.row][action.col] = 'O'
    }
    return state
}

function c4CheckTerminal(state, playerTurn, previousStates) {
    // Search rows
    for (let i = 0; i < 6; i++) {
        let count = 0
        let curSymbol = '-'
        for (let j = 0; j < 7; j++) {

            if (state[i][j] == 'X') {
                if (curSymbol == 'X') {
                    count += 1
                    if (count == 4) {
                        return true
                    }
                }
                else {
                    curSymbol = 'X'
                    count = 1
                }
            }
            else if (state[i][j] == 'O') {
                if (curSymbol == 'O') {
                    count += 1
                    if (count == 4) {
                        return true
                    }
                }
                else {
                    curSymbol = 'O'
                    count = 1
                }
            }
            else {
                count = 0
                curSymbol = '-'
            }

        }
    }


    // Search columns
    for (let j = 0; j < 7; j++) {
        let count = 0
        let curSymbol = '-'
        for (let i = 0; i < 6; i++) {
            if (state[i][j] == 'X') {
                if (curSymbol == 'X') {
                    count += 1
                    if (count == 4) {
                        return true
                    }
                }
                else {
                    curSymbol = 'X'
                    count = 1
                }
            }
            else if (state[i][j] == 'O') {
                if (curSymbol == 'O') {
                    count += 1
                    if (count == 4) {
                        return true
                    }
                }
                else {
                    curSymbol = 'O'
                    count = 1
                }
            }
            else {
                count = 0
                curSymbol = '-'
            }
        }
    }

    // Search diagonal down-right
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if ((state[i+0][j+0] == state[i+1][j+1]) && (state[i+2][j+2] == state[i+3][j+3]) && (state[i+1][j+1] == state[i+3][j+3])) {
                if (state[i+0][j+0] != '-') {
                    return true
                } 
            }
        }
    }

    // Search diagonal up-right
    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 7; j++) {
            if ((state[i+0][j-0] == state[i+1][j-1]) && (state[i+2][j-2] == state[i+3][j-3]) && (state[i+1][j-1] == state[i+3][j-3])) {
                if (state[i+0][j-0] != '-') {
                    return true
                } 
            }
        }
    }

    // Check if full
    let isFull = true
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (state[i][j] == '-') {
                isFull = false
                break
            }
        }

        if (!isFull) {
            break
        } 
    }

    if (isFull) {
        return true
    }

    return false
}


// // getNextState, previousStates, checkTerminal
c4PrintState(initialState)
// console.log(c4getPossibleActions(initialState))

// const newState = c4GetNextState(initialState, 1, { row: 5, col: 3 })

// c4PrintState(newState)
// console.log(c4getPossibleActions(newState))

console.log(c4CheckTerminal(initialState))