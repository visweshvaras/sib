import dagre from 'dagre';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parses a Sum of Products expression into nodes and edges for React Flow.
 * Handles synthesis targets: 'standard', 'nand', 'nor'
 */
export function generateLogicGraph(expression, synthesisTarget = 'standard', theme = 'dark') {
    if (!expression || expression === '1' || expression === '0' || expression.startsWith('Error')) {
        return { nodes: [], edges: [] };
    }

    const nodes = [];
    const edges = [];
    const inputNodesMap = {}; // Tracks A, B, C input nodes to avoid duplicates

    const getOrCreateInput = (varName) => {
        if (!inputNodesMap[varName]) {
            const id = `input-${varName}`;
            inputNodesMap[varName] = id;
            nodes.push({
                id,
                type: 'gate',
                data: { label: varName, type: 'INPUT', theme },
                position: { x: 0, y: 0 } // Layed out by dagre later
            });
        }
        return inputNodesMap[varName];
    };

    const addEdge = (source, target, sourceHandle = 'out', targetHandle = 'in') => {
        edges.push({
            id: `edge-${source}-${target}-${uuidv4()}`,
            source,
            target,
            sourceHandle,
            targetHandle,
            type: 'smoothstep',
            animated: true,
            style: { stroke: theme === 'dark' ? '#00d2ff' : '#2563eb', strokeWidth: 2 }
        });
    };

    const productTerms = expression.split('+').map(t => t.trim());
    const andGateIds = [];

    // --- STANDARD SOP SYNTHESIS ---
    if (synthesisTarget === 'standard') {
        productTerms.forEach((term, termIdx) => {
            const termVars = [];
            // Parse variables like "A", "B'", etc.
            for (let i = 0; i < term.length; i++) {
                if (term[i].match(/[A-Za-z]/i)) {
                    let inverted = false;
                    if (i + 1 < term.length && term[i + 1] === "'") inverted = true;

                    const varName = term[i];
                    const inputId = getOrCreateInput(varName);

                    if (inverted) {
                        const notId = `not-${varName}-${termIdx}-${uuidv4()}`;
                        nodes.push({ id: notId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
                        addEdge(inputId, notId, 'out', 'in');
                        termVars.push(notId);
                    } else {
                        termVars.push(inputId);
                    }
                }
            }

            if (termVars.length > 1) {
                const andId = `and-${termIdx}`;
                nodes.push({ id: andId, type: 'gate', data: { type: 'AND', inputs: termVars.length, theme }, position: { x: 0, y: 0 } });
                termVars.forEach((varId, idx) => addEdge(varId, andId, 'out', `in-${idx}`));
                andGateIds.push(andId);
            } else if (termVars.length === 1) {
                // Single variable term, bypass AND directly to OR
                andGateIds.push(termVars[0]);
            }
        });

        // Final OR Gate
        if (andGateIds.length > 1) {
            const orId = 'final-or';
            nodes.push({ id: orId, type: 'gate', data: { type: 'OR', inputs: andGateIds.length, theme }, position: { x: 0, y: 0 } });
            andGateIds.forEach((sourceId, idx) => addEdge(sourceId, orId, 'out', `in-${idx}`));
        }
    }
    // --- NAND-ONLY SYNTHESIS ---
    else if (synthesisTarget === 'nand') {
        // SOP: AB + CD -> NAND(NAND(A,B), NAND(C,D))
        productTerms.forEach((term, termIdx) => {
            const termVars = [];
            for (let i = 0; i < term.length; i++) {
                if (term[i].match(/[A-Za-z]/i)) {
                    let inverted = false;
                    if (i + 1 < term.length && term[i + 1] === "'") inverted = true;

                    const varName = term[i];
                    const inputId = getOrCreateInput(varName);

                    if (inverted) {
                        const notId = `not-${varName}-${termIdx}-${uuidv4()}`;
                        nodes.push({ id: notId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
                        addEdge(inputId, notId, 'out', 'in');
                        termVars.push(notId);
                    } else {
                        termVars.push(inputId);
                    }
                }
            }

            if (termVars.length > 1) {
                // First level NANDs (De Morgan's complement)
                const nandId = `nand-${termIdx}`;
                nodes.push({ id: nandId, type: 'gate', data: { type: 'NAND', inputs: termVars.length, theme }, position: { x: 0, y: 0 } });
                termVars.forEach((varId, idx) => addEdge(varId, nandId, 'out', `in-${idx}`));
                andGateIds.push(nandId);
            } else if (termVars.length === 1) {
                // Single variable must be bubbled via NOT before final NAND
                const notId = `not-bypass-${termIdx}-${uuidv4()}`;
                nodes.push({ id: notId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
                addEdge(termVars[0], notId, 'out', 'in');
                andGateIds.push(notId);
            }
        });

        if (andGateIds.length > 1) {
            // Second level NAND (combines the inverted sums)
            const finalNandId = 'final-nand';
            nodes.push({ id: finalNandId, type: 'gate', data: { type: 'NAND', inputs: andGateIds.length, theme }, position: { x: 0, y: 0 } });
            andGateIds.forEach((sourceId, idx) => addEdge(sourceId, finalNandId, 'out', `in-${idx}`));
        } else if (andGateIds.length === 1) {
            // If just one term was converted to NAND, its output is currently inverted, so we need a final inverter to restore positive logic
            const invertFinalId = `not-final-${uuidv4()}`;
            nodes.push({ id: invertFinalId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
            addEdge(andGateIds[0], invertFinalId, 'out', 'in');
        }
    }
    // --- NOR-ONLY SYNTHESIS ---
    else if (synthesisTarget === 'nor') {
        // NOR synthesis relies on Product-of-Sums. Our system outputs Sum-of-Products.
        // For standard conversion without doing a full maxterm expansion from solver, we can double-invert SOP layers with NORs.
        // X = (A'B) + (C)
        // A NOR gate requires completely restructuring. Using generic structural conversions for simplicity:
        // AND(A,B) -> NOR(NOT(A), NOT(B))
        // OR(X,Y) -> NOT(NOR(X,Y))

        const intermediateOrs = [];

        productTerms.forEach((term, termIdx) => {
            const invertedVars = [];
            for (let i = 0; i < term.length; i++) {
                if (term[i].match(/[A-Za-z]/i)) {
                    let isOriginalInverted = false;
                    if (i + 1 < term.length && term[i + 1] === "'") isOriginalInverted = true;

                    const varName = term[i];
                    const inputId = getOrCreateInput(varName);

                    if (isOriginalInverted) {
                        // Original expression wanted NOT, so we just use the literal
                        invertedVars.push(inputId);
                    } else {
                        // We need to invert it for the NOR gate
                        const notId = `not-${varName}-${termIdx}-${uuidv4()}`;
                        nodes.push({ id: notId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
                        addEdge(inputId, notId, 'out', 'in');
                        invertedVars.push(notId);
                    }
                }
            }

            if (invertedVars.length > 1) {
                // This NOR acts as an AND gate because we negated its inputs
                const norId = `nor-as-and-${termIdx}`;
                nodes.push({ id: norId, type: 'gate', data: { type: 'NOR', inputs: invertedVars.length, theme }, position: { x: 0, y: 0 } });
                invertedVars.forEach((varId, idx) => addEdge(varId, norId, 'out', `in-${idx}`));
                intermediateOrs.push(norId);
            } else if (invertedVars.length === 1) {
                // Revert the inversion we made above since it bypasses the "AND" step
                const notId = `not-bypass-${termIdx}-${uuidv4()}`;
                nodes.push({ id: notId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
                addEdge(invertedVars[0], notId, 'out', 'in');
                intermediateOrs.push(notId);
            }
        });

        if (intermediateOrs.length > 1) {
            // Tie terms together with a NOR and then invert the output (OR = NOT(NOR))
            const comboNorId = 'combo-nor';
            nodes.push({ id: comboNorId, type: 'gate', data: { type: 'NOR', inputs: intermediateOrs.length, theme }, position: { x: 0, y: 0 } });
            intermediateOrs.forEach((sourceId, idx) => addEdge(sourceId, comboNorId, 'out', `in-${idx}`));

            const finalNotId = 'final-not';
            nodes.push({ id: finalNotId, type: 'gate', data: { type: 'NOT', theme }, position: { x: 0, y: 0 } });
            addEdge(comboNorId, finalNotId, 'out', 'in');
        }
    }

    // --- FINALLY: Append the Lightbulb OUTPUT Node ---
    // The final ID of the main logic block will be the last node added before this step
    const finalLogicNodeId = nodes[nodes.length - 1]?.id;
    if (finalLogicNodeId) {
        const outputNodeId = 'lightbulb-output';
        nodes.push({ id: outputNodeId, type: 'gate', data: { type: 'OUTPUT', theme }, position: { x: 0, y: 0 } });
        addEdge(finalLogicNodeId, outputNodeId, 'out', 'in');
    }

    return applyAutoLayout(nodes, edges);
}

// Applies Dagre to automatically position graph nodes so wires don't overlap wildly
function applyAutoLayout(nodes, edges) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', ranksep: 120, nodesep: 60 }); // Left to Right

    nodes.forEach((node) => {
        // Approximate width/height of custom SVG nodes
        dagreGraph.setNode(node.id, { width: 100, height: 60 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = 'left';
        node.sourcePosition = 'right';
        node.position = {
            x: nodeWithPosition.x - 50, // offset center coords returned by dagre
            y: nodeWithPosition.y - 30
        };
    });

    return { nodes, edges };
}
