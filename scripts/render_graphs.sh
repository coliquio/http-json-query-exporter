#!/bin/sh

GRAPHS_PATHS=(docs/concept docs/task)
for graph_path in "${GRAPHS_PATHS[@]}"; do
  cat $graph_path.dot | dot -Tpng > $graph_path.png
done