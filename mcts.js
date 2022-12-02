/**
 * Monte Carlo Tree Search Algorithm
 * Author: Kelly Ristovsky
 * Date: Nov-22
 * Purpose: This code is designed to be adaptable for any game.
 */

const explorationFactor = 0.7

/**
 * Stores game State information
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

// Calculates the UCB Score for a given Node
function ucbScore(n, s, c, nParent) {
    return (s / n) + c * Math.sqrt((2 * Math.log(nParent)) / n)
}

function mctsAlgorithm(initialState, initialPlayerTurn, numIterations, getPossibleActions, getNextState, previousStates, checkTerminal, checkGain) {
    // First initialize the root node
    let root = new Node(initialState, initialPlayerTurn, false)

    for (let i = 0; i < numIterations; i++) {
        // console.log(`Iteration number ${i}`)
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
 * CONNECT 4 GAME
 */

function c4PrintState(state) {
    for (let i = 0; i < 6; i++) {
        console.log(`${state[i][0]} ${state[i][1]} ${state[i][2]} ${state[i][3]} ${state[i][4]} ${state[i][5]} ${state[i][6]}`)
    }
    console.log('\n')
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
    let tempState = state.map(inner => inner.slice())
    if (playerTurn == 1) {
        tempState[action.row][action.col] = 'X'
    }
    if (playerTurn == -1) {
        tempState[action.row][action.col] = 'O'
    }
    return tempState
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
            if ((state[i + 0][j + 0] == state[i + 1][j + 1]) && (state[i + 2][j + 2] == state[i + 3][j + 3]) && (state[i + 1][j + 1] == state[i + 3][j + 3])) {
                if (state[i + 0][j + 0] != '-') {
                    return true
                }
            }
        }
    }

    // Search diagonal up-right
    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 7; j++) {
            if ((state[i + 0][j - 0] == state[i + 1][j - 1]) && (state[i + 2][j - 2] == state[i + 3][j - 3]) && (state[i + 1][j - 1] == state[i + 3][j - 3])) {
                if (state[i + 0][j - 0] != '-') {
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

function c4CheckGain(state, playerTurn, previousStates) {
    // Search rows
    for (let i = 0; i < 6; i++) {
        let count = 0
        let curSymbol = '-'
        for (let j = 0; j < 7; j++) {

            if (state[i][j] == 'X') {
                if (curSymbol == 'X') {
                    count += 1
                    if (count == 4) {
                        if (playerTurn == 1) {
                            return 1
                        }
                        else {
                            return 0
                        }
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
                        if (playerTurn == -1) {
                            return 1
                        }
                        else {
                            return 0
                        }
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
                        if (playerTurn == 1) {
                            return 1
                        }
                        else {
                            return 0
                        }
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
                        if (playerTurn == -1) {
                            return 1
                        }
                        else {
                            return 0
                        }
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
            if ((state[i + 0][j + 0] == state[i + 1][j + 1]) && (state[i + 2][j + 2] == state[i + 3][j + 3]) && (state[i + 1][j + 1] == state[i + 3][j + 3])) {
                if (state[i + 0][j + 0] != '-') {
                    if ((playerTurn == 1) && (state[i + 0][j + 0] == 'X')) {
                        return 1
                    }
                    else if ((playerTurn == -1) && (state[i + 0][j + 0] == 'O')) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }
            }
        }
    }

    // Search diagonal up-right
    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 7; j++) {
            if ((state[i + 0][j - 0] == state[i + 1][j - 1]) && (state[i + 2][j - 2] == state[i + 3][j - 3]) && (state[i + 1][j - 1] == state[i + 3][j - 3])) {
                if (state[i + 0][j - 0] != '-') {
                    if ((playerTurn == 1) && (state[i + 0][j - 0] == 'X')) {
                        return 1
                    }
                    else if ((playerTurn == -1) && (state[i + 0][j - 0] == 'O')) {
                        return 1
                    }
                    else {
                        return 0
                    }
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
        return 0.5
    }
}

function c4ChooseRandomAction(actions) {
    const randomIndex = Math.floor(Math.random() * actions.length)
    return actions[randomIndex]
}


const initialState = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-']
]
// const initialState = [
//     ['-', '-', 'X', 'O', '-', '-', 'X'],
//     ['-', '-', 'O', 'O', '-', '-', 'X'],
//     ['X', '-', 'O', 'X', '-', 'O', 'X'],
//     ['O', '-', 'O', 'O', '-', 'O', 'O'],
//     ['X', '-', 'X', 'X', 'O', 'O', 'X'],
//     ['X', 'X', 'X', 'O', 'O', 'X', 'X']
// ]

const prompt = require("prompt-sync")({ sigint: true })


let p1Win = 0
let p2Win = 0
let draw = 0

for (let g = 0; g < 1000; g++) {

    let currentState = initialState

    while (true) {

        // Player 1 - Random AI
        const choosenActionP1 = c4ChooseRandomAction(c4getPossibleActions(currentState))
        currentState = c4GetNextState(currentState, 1, choosenActionP1)

        if (c4CheckTerminal(currentState)) {
            // console.log('Player 1 end')
            // c4PrintState(currentState)
            if (c4CheckGain(currentState, 1) == 1) {
                p1Win += 1
            }
            else if (c4CheckGain(currentState, 1) == 0) {
                p2Win += 1
            }
            else {
                draw += 1
            }
            break
        }

        // Player 2 - random AI
        const choosenActionP2 = mctsAlgorithm(currentState, -1, 1000, c4getPossibleActions, c4GetNextState, false, c4CheckTerminal, c4CheckGain)
        currentState = c4GetNextState(currentState, -1, choosenActionP2)


        if (c4CheckTerminal(currentState)) {
            // console.log('Player 2 end')
            // c4PrintState(currentState)
            if (c4CheckGain(currentState, -1) == 1) {
                p2Win += 1
            }
            else if (c4CheckGain(currentState, -1) == 0) {
                p1Win += 1
            }
            else {
                draw += 1
            }
            break
        }
    }
}

console.log(`${p1Win}  ${p2Win}  ${draw}`)

