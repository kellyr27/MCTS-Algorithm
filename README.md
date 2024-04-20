# Monte Carlo Tree Search Implementation

## Project Description
This project implements the Monte Carlo Tree Search (MCTS) algorithm for the deterministic game Connect Four. Notably, the algorithm's versatility enables its application to any two-player deterministic game. The implementation is written in Node.js.

Originally developed as a Major Project for COMP4121 Advanced Algorithms at UNSW, Australia.

## Run Project

To run this project from the command line in the project directory, use the following format:
```console
node index.js {Number of games simulated} {Number of iterations for MCTS AI 1} {Number of iterations for MCTS AI 2}
```

For example, running the following command:
```console
node index.js 1000 10 100
```
would produce output similar to the following (actual figures may vary due to probabilistic nature):
```console
P1 wins: 69     P2 wins:  931   Draws:  0
```
This simulates 1000 games between an MCTS AI with 10 iterations and an MCTS AI with 100 iterations.

Note: The number of games must be even, as each AI plays an equal number of games as 'X' and 'O'.
