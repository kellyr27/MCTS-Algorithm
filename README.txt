You must have NodeJS installed. No package dependencies are required to run this project

Format to run this project in the command line in the file directory:
> node index.js {Number of games simulated} {Number of iterations for MCTS AI 1} {Number of iterations for MCTS AI 2}

For example running the following line in the command line:
> node index.js 1000 10 100
The output for this should be something like below:
P1 wins: 69     P2 wins:  931   Draws:  0
This simulated 1000 games between an MCTS with 1000 iterations against an MCTS with 100 iterations.

Note: Number of games must be even as each AI plays an equal amount of games as 'X' and 'O'.