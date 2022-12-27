# Monte Carlo Tree Search Implementation

## Project Description
Implementation of the Monte Carlo Tree Search (MCTS) algorithm through deterministic game Connect Four. The algorithm implemented is independent of the game, so it can be implemented with any two player, deterministic game. Implemented in NodeJS. 

Originally implemented for Major Project for COMP4121 Advanced Algorithms (UNSW, Australia).

## Run Project

Format to run this project in the command line in the file directory:
```console
node index.js {Number of games simulated} {Number of iterations for MCTS AI 1} {Number of iterations for MCTS AI 2}
```

For example running the following line in the command line:
```console
node index.js 1000 10 100
```
The output for this should be something like below (not exact figures as output is probabilistic):
```console
P1 wins: 69     P2 wins:  931   Draws:  0
```
This simulated 1000 games between an MCTS with 1000 iterations against an MCTS with 100 iterations.

Note: Number of games must be even as each AI plays an equal amount of games as 'X' and 'O'.
