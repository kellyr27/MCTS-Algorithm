/**
 * Main Page
 * Author: Kelly Ristovsky
 * Date: Nov-22
 * Purpose: - Run testing for the MTCS Algorithm on Connect 4 game for submission for COMP4121 Major Project.
 *          - Currently set up for MTCS vs MTCS
 */

const { mctsAlgorithm, chooseRandomAction } = require('./mcts');
const { c4PrintState, c4getPossibleActions, c4GetNextState, c4CheckTerminal, c4CheckGain } = require('./connect4');

/**
 * Read the command line arguments
 */
const myArgs = process.argv.slice(2);

/**
 * CONSTANTS
 */
const numberOfGames = parseInt(myArgs[0])
const numberOfEpisodesPlayer1 = parseInt(myArgs[1])
const numberOfEpisodesPlayer2 = parseInt(myArgs[2])

/**
 * Counts number of wins for Player 1 & 2 and draws
 */
let p1Win = 0
let p2Win = 0
let draw = 0

const initialState = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-']
]

// Iterate through a selected number of games

// P1 as 'X', P2 as 'O'
for (let g = 0; g < Math.floor(numberOfGames / 2); g++) {

    let currentState = initialState

    // Play game to completion
    while (true) {

        /**
         * PLAYER 1
         */

        const choosenActionP1 = mctsAlgorithm(currentState, 1, numberOfEpisodesPlayer1, c4getPossibleActions, c4GetNextState, false, c4CheckTerminal, c4CheckGain)
        currentState = c4GetNextState(currentState, 1, choosenActionP1)

        // Check if the game has finished
        if (c4CheckTerminal(currentState)) {

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

        /**
         * PLAYER 2
         */

        const choosenActionP2 = mctsAlgorithm(currentState, -1, numberOfEpisodesPlayer2, c4getPossibleActions, c4GetNextState, false, c4CheckTerminal, c4CheckGain)
        currentState = c4GetNextState(currentState, -1, choosenActionP2)

        // Check if the game has finished
        if (c4CheckTerminal(currentState)) {

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

// P1 as 'X', P2 as 'O'
for (let g = 0; g < Math.floor(numberOfGames / 2); g++) {

    let currentState = initialState

    // Play game to completion
    while (true) {

        /**
         * PLAYER 1
         */

        const choosenActionP2 = mctsAlgorithm(currentState, 1, numberOfEpisodesPlayer2, c4getPossibleActions, c4GetNextState, false, c4CheckTerminal, c4CheckGain)
        currentState = c4GetNextState(currentState, 1, choosenActionP2)

        // Check if the game has finished
        if (c4CheckTerminal(currentState)) {

            if (c4CheckGain(currentState, 1) == 1) {
                p2Win += 1
            }
            else if (c4CheckGain(currentState, 1) == 0) {
                p1Win += 1
            }
            else {
                draw += 1
            }
            break
        }

        /**
         * PLAYER 2
         */

        const choosenActionP1 = mctsAlgorithm(currentState, -1, numberOfEpisodesPlayer1, c4getPossibleActions, c4GetNextState, false, c4CheckTerminal, c4CheckGain)
        currentState = c4GetNextState(currentState, -1, choosenActionP1)

        // Check if the game has finished
        if (c4CheckTerminal(currentState)) {

            if (c4CheckGain(currentState, -1) == 1) {
                p1Win += 1
            }
            else if (c4CheckGain(currentState, -1) == 0) {
                p2Win += 1
            }
            else {
                draw += 1
            }
            break
        }
    }
}

/**
 * Print the final results (number of wins/draws)
 */
console.log(`P1 wins: ${p1Win}\tP2 wins:  ${p2Win}\tDraws:  ${draw}`)