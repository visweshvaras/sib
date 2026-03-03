import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import { GateNode } from './GateNodes';
import { generateLogicGraph } from './LogicGraphBuilder';
import { simulateLogic } from './LogicSimulator';

const nodeTypes = {
    gate: GateNode,
};

export function LogicGateVisualizer({ expression, theme = 'dark', synthesisTarget = 'standard' }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Track manual toggles of the inputs: { 'A': true, 'B': false }
    const [inputStates, setInputStates] = useState({});
    // Ref flag: did we already run the initial simulation after graph load?
    const initialSimDone = useRef(false);

    // 1. Generate the base abstract graph whenever expression/target changes
    useEffect(() => {
        initialSimDone.current = false; // Reset so new graph triggers initial sim
        if (expression && !expression.startsWith('Error')) {
            const graph = generateLogicGraph(expression, synthesisTarget, theme);

            // Initialize all found inputs to FALSE (0) by default
            const initialStates = {};
            graph.nodes.forEach(n => {
                if (n.data.type === 'INPUT' && initialStates[n.data.label] === undefined) {
                    initialStates[n.data.label] = false;
                }
            });

            // Set edges first, then nodes, then let the sim effect run via inputStates reset
            setEdges(graph.edges);
            setNodes(graph.nodes);
            setInputStates(initialStates);
        } else {
            setNodes([]);
            setEdges([]);
            setInputStates({});
        }
    }, [expression, synthesisTarget, theme, setEdges, setNodes]);

    // 2. Handle User Clicking an Input node
    const handleInputToggle = useCallback((varName) => {
        setInputStates(prev => ({
            ...prev,
            [varName]: !prev[varName]
        }));
    }, []);

    // 3. Whenever Input States change, run the simulation and update node/edge visual state
    useEffect(() => {
        if (nodes.length === 0 || edges.length === 0) return;

        // Run topological simulation engine
        const simResults = simulateLogic(nodes, edges, inputStates);
        initialSimDone.current = true;

        // Map the boolean results back into each node's data so they visually light up
        setNodes(nds => nds.map(node => ({
            ...node,
            data: {
                ...node.data,
                isHigh: simResults[node.id] || false,
                onToggle: node.data.type === 'INPUT' ? handleInputToggle : undefined
            }
        })));

        // Color edges based on whether they carry a HIGH signal
        setEdges(eds => eds.map(edge => {
            const isCarryingHigh = simResults[edge.source] === true;
            return {
                ...edge,
                animated: isCarryingHigh,
                style: {
                    ...edge.style,
                    stroke: isCarryingHigh ? '#22c55e' : (theme === 'dark' ? '#374151' : '#d1d5db'),
                    strokeWidth: isCarryingHigh ? 3 : 2
                }
            };
        }));

        // Intentionally omitting 'nodes' and 'edges' from deps to prevent infinite loop.
        // Simulation re-runs only when inputStates or theme changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputStates, theme, handleInputToggle, setNodes, setEdges]);


    if (!expression || expression.startsWith('Error')) return null;

    return (
        <div style={{ width: '100%', height: '70vh', minHeight: '500px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
            >
                <Background
                    variant="dots"
                    gap={20}
                    size={1}
                    color={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                />
                <Controls
                    style={{
                        background: theme === 'dark' ? '#1f2937' : '#ffffff',
                        fill: theme === 'dark' ? '#ffffff' : '#000000',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <MiniMap
                    nodeColor={theme === 'dark' ? '#374151' : '#e5e7eb'}
                    maskColor={theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}
                    style={{ background: theme === 'dark' ? '#111827' : '#ffffff' }}
                />

                {/* On-canvas hints for the user */}
                <Panel position="top-left" style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                    💡 Drag gates to reposition<br />
                    ⚡ Click Input blocks (A, B...) to toggle 0/1 signal
                </Panel>
            </ReactFlow>
        </div>
    );
}
