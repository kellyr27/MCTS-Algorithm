/**
 * Connect 4 Game
 * Author: Kelly Ristovsky
 * Date: Nov-22
 * Purpose: - Game designed to be used for testing the effectiveness of the MCTS.
 *          - Two player game, playerTurn is either:
 *                  1       'X'
 *                  -1      'O'
 */

/**
 * Prints a state to the console for testing.
 * @param {Array} state 
 */
function c4PrintState(state) {
    for (let i = 0; i < 6; i++) {
        console.log(`${state[i][0]} ${state[i][1]} ${state[i][2]} ${state[i][3]} ${state[i][4]} ${state[i][5]} ${state[i][6]}`)
    }
    console.log('\n')
}

/**
 * Returns a list of all possible actions for a given state
 * @param {Array} state 
 * @param {Number} playerTurn 
 * @returns 
 */
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

/**
 * Returns the next State after an Action has been taken
 * @param {Array} state 
 * @param {Number} playerTurn 
 * @param {Object} action 
 * @returns {Array}
 */
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

/**
 * Returns whether the current state is a Terminating state (the state is currently a win/draw)
 * @param {Array} state 
 * @param {Number} playerTurn 
 * @param {Array} previousStates 
 * @returns {Boolean}
 */
function c4CheckTerminal(state, playerTurn, previousStates) {
    // Search rows for any 4 in row
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

    // Search columns for any 4 in row
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

    // Search diagonal down-right for any 4 in row
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if ((state[i + 0][j + 0] == state[i + 1][j + 1]) && (state[i + 2][j + 2] == state[i + 3][j + 3]) && (state[i + 1][j + 1] == state[i + 3][j + 3])) {
                if (state[i + 0][j + 0] != '-') {
                    return true
                }
            }
        }
    }

    // Search diagonal up-right for any 4 in row
    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 7; j++) {
            if ((state[i + 0][j - 0] == state[i + 1][j - 1]) && (state[i + 2][j - 2] == state[i + 3][j - 3]) && (state[i + 1][j - 1] == state[i + 3][j - 3])) {
                if (state[i + 0][j - 0] != '-') {
                    return true
                }
            }
        }
    }

    // Check if board is full
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

/**
 * Returns the Gain from a terminating state for a given Player
 * Gains:
 *      Win     1
 *      Draw    0.5
 *      Loss    0
 * @param {Array} state 
 * @param {Number} playerTurn 
 * @param {Array} previousStates 
 * @returns {Number}
 */
function c4CheckGain(state, playerTurn, previousStates) {
    
    // Search rows for any 4 in row
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


    // Search columns for any 4 in row
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

    // Search diagonal down-right for any 4 in row
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

    // Search diagonal up-right for any 4 in row
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

    // Check if board is full
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

module.exports = {c4PrintState, c4getPossibleActions, c4GetNextState, c4CheckTerminal, c4CheckGain}