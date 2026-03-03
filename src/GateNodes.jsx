// Custom ReactFlow Node for Logic Gates
import React from 'react';
import { Handle, Position } from 'reactflow';
import { Lightbulb } from 'lucide-react';

export const GateNode = ({ data }) => {
    // Determine colors and shapes based on the logic family theme and gate type
    const isDark = data.theme !== 'light';
    const bgColor = isDark ? '#1a1a2e' : '#f8fafc';
    const textColor = isDark ? '#ffffff' : '#111827';
    const strokeColor = isDark ? '#4a90e2' : '#2563eb'; // Accent color

    // Check if node is actively high (true) or low (false) from the simulation engine
    const isHigh = data.isHigh === true;

    // For Inputs
    if (data.type === 'INPUT') {
        const bgActive = isHigh ? '#22c55e' : (isDark ? '#374151' : '#e5e7eb');
        const textActive = isHigh ? '#ffffff' : textColor;
        return (
            <div
                style={{
                    background: bgActive,
                    border: `2px solid ${isDark ? '#00d2ff' : '#005bb5'}`,
                    padding: '10px 15px',
                    borderRadius: '8px',
                    color: textActive,
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: isHigh ? '0 0 15px rgba(34, 197, 94, 0.5)' : (isDark ? '0 0 10px rgba(0,210,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                }}
                onClick={() => {
                    if (data.onToggle) data.onToggle(data.label);
                }}
                title="Click to toggle Input (1/0)"
            >
                {data.label} = {isHigh ? '1' : '0'}
                <Handle type="source" position={Position.Right} id="out" style={{ background: isHigh ? '#22c55e' : strokeColor, width: '8px', height: '8px' }} />
            </div>
        );
    }

    // For The Output Light bulb
    if (data.type === 'OUTPUT') {
        return (
            <div style={{
                background: bgColor,
                border: `2px solid ${isHigh ? '#eab308' : (isDark ? '#4b5563' : '#9ca3af')}`,
                padding: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHigh ? '0 0 30px rgba(234, 179, 8, 0.8)' : 'none',
                transition: 'all 0.3s ease'
            }}>
                <Lightbulb
                    size={32}
                    color={isHigh ? '#eab308' : (isDark ? '#4b5563' : '#9ca3af')}
                    fill={isHigh ? '#fef08a' : 'transparent'}
                />
                <Handle type="target" position={Position.Left} id="in" style={{ background: isHigh ? '#eab308' : strokeColor, width: '8px', height: '8px' }} />
            </div>
        );
    }

    // For AND / NAND
    if (data.type.includes('AND')) {
        const isNand = data.type === 'NAND';
        return (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="60" height="50" viewBox="0 0 60 50">
                    <path d="M 5,5 L 30,5 A 20,20 0 0 1 30,45 L 5,45 Z" fill={bgColor} stroke={strokeColor} strokeWidth="3" />
                    <text x="22" y="30" fill={textColor} fontSize="12" fontWeight="bold" textAnchor="middle">{data.type}</text>
                    {isNand && <circle cx="53" cy="25" r="4" fill={bgColor} stroke={strokeColor} strokeWidth="3" />}
                </svg>
                {/* Dynamically render input handles based on how many sources feed into this gate */}
                {Array.from({ length: Math.max(2, data.inputs || 2) }).map((_, i, arr) => {
                    const topOffset = 20 + (i * (60 / Math.max(1, arr.length - 1))); // Stagger handles
                    return (
                        <Handle key={i} type="target" position={Position.Left} id={`in-${i}`} style={{ top: `${topOffset}%`, background: strokeColor, width: '6px', height: '6px' }} />
                    );
                })}
                <Handle type="source" position={Position.Right} id="out" style={{ background: isHigh ? '#22c55e' : strokeColor, width: '8px', height: '8px', right: isNand ? '-8px' : '2px' }} />
            </div>
        );
    }

    // For OR / NOR
    if (data.type.includes('OR')) {
        const isNor = data.type === 'NOR';
        return (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="60" height="50" viewBox="0 0 60 50">
                    <path d="M 5,5 C 20,5 35,15 50,25 C 35,35 20,45 5,45 C 10,35 10,15 5,5 Z" fill={bgColor} stroke={textColor} strokeWidth="3" />
                    <text x="25" y="30" fill={textColor} fontSize="12" fontWeight="bold" textAnchor="middle">{data.type}</text>
                    {isNor && <circle cx="55" cy="25" r="4" fill={bgColor} stroke={textColor} strokeWidth="3" />}
                </svg>
                {Array.from({ length: Math.max(2, data.inputs || 2) }).map((_, i, arr) => {
                    const topOffset = 20 + (i * (60 / Math.max(1, arr.length - 1)));
                    return (
                        <Handle key={i} type="target" position={Position.Left} id={`in-${i}`} style={{ top: `${topOffset}%`, background: textColor, width: '6px', height: '6px', left: '6px' }} />
                    );
                })}
                <Handle type="source" position={Position.Right} id="out" style={{ background: isHigh ? '#22c55e' : textColor, width: '8px', height: '8px', right: isNor ? '-8px' : '2px' }} />
            </div>
        );
    }

    // For NOT (Inverter)
    if (data.type === 'NOT') {
        return (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="50" height="40" viewBox="0 0 50 40">
                    <polygon points="5,5 35,20 5,35" fill={bgColor} stroke="#ff4d4d" strokeWidth="3" />
                    <circle cx="41" cy="20" r="4" fill={bgColor} stroke="#ff4d4d" strokeWidth="3" />
                </svg>
                <Handle type="target" position={Position.Left} id="in" style={{ background: '#ff4d4d', width: '6px', height: '6px', left: '2px' }} />
                <Handle type="source" position={Position.Right} id="out" style={{ background: isHigh ? '#22c55e' : '#ff4d4d', width: '8px', height: '8px', right: '0px' }} />
            </div>
        );
    }

    // Default Fallback
    return (
        <div style={{ padding: '10px', background: 'white', border: '1px solid black', borderRadius: '5px' }}>
            {data.label || data.type}
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
};
