/**
 * Logic Simulation Engine
 * Given a Graph consisting of nodes and edges, and an initial input state mapping,
 * this function computes the Boolean output of every node propagating left to right.
 */
export function simulateLogic(nodes, edges, inputStates) {
    // Map to hold the computed output value (true/false) for each node ID
    const nodeOutputs = {};

    // 1. Initialize input nodes with their state
    nodes.forEach(node => {
        if (node.data.type === 'INPUT') {
            // inputStates holds e.g., { 'A': true, 'B': false }
            nodeOutputs[node.id] = inputStates[node.data.label] || false;
        }
    });

    // 2. We must evaluate nodes in topological order.
    // We already built them semi-topologically in LogicGraphBuilder, but to be safe,
    // we use a simple dependency resolution loop.
    let changed = true;
    let iterations = 0;
    const maxIterations = nodes.length; // Prevent infinite loops

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        nodes.forEach(node => {
            if (node.data.type === 'INPUT') return; // Already resolved
            if (node.data.type === 'OUTPUT') {
                // Determine what the bulb sees based on the single edge going into it
                const incomingEdge = edges.find(e => e.target === node.id);
                if (incomingEdge && nodeOutputs[incomingEdge.source] !== undefined) {
                    const newVal = nodeOutputs[incomingEdge.source];
                    if (nodeOutputs[node.id] !== newVal) {
                        nodeOutputs[node.id] = newVal;
                        changed = true;
                    }
                }
                return;
            }

            // Find all incoming edges to this gate
            const incomingEdges = edges.filter(e => e.target === node.id);
            // Get the values from the source nodes of these edges
            const inputValues = incomingEdges.map(e => nodeOutputs[e.source]).filter(v => v !== undefined);

            // Wait until ALL inputs to this gate have been evaluated before computing
            if (inputValues.length > 0 && inputValues.length === incomingEdges.length) {
                let result = false;

                switch (node.data.type) {
                    case 'AND':
                        result = inputValues.every(v => v === true);
                        break;
                    case 'OR':
                        result = inputValues.some(v => v === true);
                        break;
                    case 'NAND':
                        result = !(inputValues.every(v => v === true));
                        break;
                    case 'NOR':
                        result = !(inputValues.some(v => v === true));
                        break;
                    case 'NOT':
                        result = !inputValues[0];
                        break;
                    default:
                        result = false;
                }

                if (nodeOutputs[node.id] !== result) {
                    nodeOutputs[node.id] = result;
                    changed = true;
                }
            }
        });
    }

    return nodeOutputs;
}
