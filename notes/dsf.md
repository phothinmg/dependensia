# Depth-First Search (DFS) Algorithm

An algorithm used for traversing or searching tree or graph data structures. It explores as far as possible along each branch before backtracking.

Here's how DFS generally works:

**Start at a chosen node (often called the root in a tree or a starting vertex in a graph).**

**Mark the current node as visited.** This prevents revisiting the same node and getting stuck in cycles.

**Explore an unvisited neighbor:** Pick one of the unvisited neighbors of the current node and recursively apply DFS to that neighbor.

**Backtrack:** If the current node has no unvisited neighbors (i.e., you've reached a "dead end" in that path), or if all its neighbors have already been visited, the algorithm backtracks to the previous node in the path and continues exploring from there.

**Repeat:** This process of exploring deeply and then backtracking continues until all reachable nodes from the starting point have been visited.

Applications:

- **Finding connected components in a graph.**

- **Detecting cycles in a graph.**

- **Topological sorting: (for directed acyclic graphs).**

- **Solving mazes or puzzles that require exploring paths.**

- **Finding paths between two nodes.**

- **As a subroutine in other graph algorithms:** like finding strongly connected components or biconnected components.

DFS has a wide range of applications in computer science and beyond.In my case used DFS for detecting cycles in dependencies graph.

## Source

- <https://en.wikipedia.org/wiki/Depth-first_search#External_links>
- <https://medium.com/@that-software-PM/depth-first-search-dfs-algorithm-201dc95e524>
- <https://github.com/AvraamMavridis/Algorithms-Data-Structures-in-Typescript/blob/master/algorithms/bfs-dfs.md>
- <https://medium.com/@ilimalbayrak/mastering-typescript-exploring-data-structures-and-algorithms-part-ii-1ff0e823e91b>
- <https://www.devmaking.com/learn/algorithms/depth-first-search/typescript/>
