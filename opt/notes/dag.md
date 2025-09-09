
# Directed acyclic graph (DAG)

**graph:** structure consisting of nodes, that are connected to each other with edges.

**directed:** the connections between the nodes (edges) have a direction: A -> B is not the same as B -> A

**acyclic(non-circular):** moving from node to node by following the edges, you will never encounter the same node for the second time.

## The components of a DAG

**Nodes:** Nodes, also known as vertices, represent entities, objects or variables on a graph. They are typically depicted as dots or circles.

**Edges:** Edges represent connections between entities. They are depicted as lines.

**Directed edges:** Directed edges represent connections that might be traversed in only 1 direction. Arrows on such edges indicate their direction.

**Directed graphs:** Graphs made up entirely of directed edges are directed graphs or digraphs. In contrast, graphs without directed edges are undirected graphs.

**Colliders:** Colliders are nodes that have 2 directed edges pointing at them.

**Paths:** Paths are a sequence of edges connecting 1 given node to another. Paths consisting entirely of directed edges are known as directed paths. Directed paths that indicate causal relationships are called causal paths.

**Tree:** In computer science, a tree is a directed acyclic graph in which every node has only 1 directed edge pointing to it, save for the starting node (the “root” node). While edges extend from the root node, no edges point to the root node.

## Topological sorting

A topological sort, also known as a topological ordering, is a way of organizing the nodes of a DAG in a linear fashion so that the nodes that point to other nodes appear first and successors don't appear before their predecessors. Topological sort algorithms can produce such sequences based on DAGs.(One of graph theory concepts relevant to DAG)

## Source

- <https://en.wikipedia.org/wiki/Directed_acyclic_graph>
- <https://cran.r-project.org/web/packages/ggdag/vignettes/intro-to-dags.html>
- <https://www.ibm.com/think/topics/directed-acyclic-graph>
- <https://stackoverflow.com/questions/228375can-someone-explain-in-simple-terms-to-me-what-a-directed-acyclic-graph-is>
- <https://en.wikipedia.org/wiki/Topological_sorting>
