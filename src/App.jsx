import React, { useState, Suspense, useRef } from 'react';
import './App.css';
import CubesScene from './CubesScene';
import { solveQM } from './qmLogic';
import { generateVerilog, generateSystemVerilog } from './verilogGenerator';
import KMapVisualizer from './KMapVisualizer';
import { LogicGateVisualizer } from './LogicGateVisualizer';
import { MathModel } from './MathModel';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Cpu, Zap, Activity, Download, Image as ImageIcon, Maximize2, X, Moon, Sun, Copy, Check } from 'lucide-react';

function App() {
    const [minterms, setMinterms] = useState('');
    const [varCount, setVarCount] = useState('4');
    const [termType, setTermType] = useState('min'); // 'min' or 'max'
    const [result, setResult] = useState(null);
    const [isComputing, setIsComputing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diagramTheme, setDiagramTheme] = useState('dark');
    const [synthesisTarget, setSynthesisTarget] = useState('standard');
    const [activeTab, setActiveTab] = useState('solver');

    const [activeMinterms, setActiveMinterms] = useState([]);
    const [activeNumVars, setActiveNumVars] = useState(4);
    const [copiedIndicator, setCopiedIndicator] = useState(null);

    const visualizerRef = useRef(null);

    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndicator(type);
            setTimeout(() => setCopiedIndicator(null), 2000);
        });
    };

    const handleOptimize = () => {
        if (!minterms.trim()) return;
        setIsComputing(true);

        setTimeout(() => {
            const numVars = parseInt(varCount, 10);
            const n = isNaN(numVars) ? 4 : numVars;

            let inputTerms = minterms;

            // If maxterms: compute the complementary minterms for the QM solver
            if (termType === 'max') {
                const maxSet = new Set(
                    minterms.split(',')
                        .map(m => m.trim())
                        .filter(m => m !== '')
                        .map(m => parseInt(m, 10))
                        .filter(m => !isNaN(m))
                );
                const totalMinterms = Math.pow(2, n);
                const derivedMinterms = [];
                for (let i = 0; i < totalMinterms; i++) {
                    if (!maxSet.has(i)) derivedMinterms.push(i);
                }
                inputTerms = derivedMinterms.join(', ');
            }

            const optimizedExpression = solveQM(inputTerms, n);
            setResult(optimizedExpression);

            // Snap exact minterm integer array and variable count for KMap
            if (!optimizedExpression.startsWith('Error')) {
                const parsedTerms = inputTerms.split(',')
                    .map(m => m.trim())
                    .filter(m => m !== '')
                    .map(m => parseInt(m, 10))
                    .filter(m => !isNaN(m));
                setActiveMinterms(parsedTerms);
                setActiveNumVars(n);
            }

            setIsComputing(false);
        }, 800);
    };

    const exportToImage = async () => {
        const flowElement = document.querySelector('.react-flow__viewport');
        if (!flowElement || !result || result.startsWith('Error')) return;

        try {
            const transform = flowElement.style.transform;
            // Reset transform so html2canvas captures full unzoomed content
            flowElement.style.transform = `translate(0px, 0px) scale(1)`;

            // Wait one animation frame so the browser repaints before capturing
            await new Promise(resolve => requestAnimationFrame(resolve));

            const bgColor = diagramTheme === 'dark' ? '#101827' : '#ffffff';
            const canvas = await html2canvas(flowElement, {
                backgroundColor: bgColor,
                scale: 2,
                logging: false,
                useCORS: true
            });

            // Restore the original ReactFlow zoom/pan transform immediately
            flowElement.style.transform = transform;

            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `logic-schema-${synthesisTarget}-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
        }
    };

    const exportToPDF = async () => {
        const flowElement = document.querySelector('.react-flow__viewport');
        if (!flowElement || !result || result.startsWith('Error')) return;

        try {
            const transform = flowElement.style.transform;
            // Reset transform so html2canvas captures full unzoomed content
            flowElement.style.transform = `translate(0px, 0px) scale(1)`;

            // Wait one animation frame so the browser repaints before capturing
            await new Promise(resolve => requestAnimationFrame(resolve));

            const bgColor = diagramTheme === 'dark' ? '#101827' : '#ffffff';
            const canvas = await html2canvas(flowElement, { backgroundColor: bgColor, scale: 2, logging: false });

            // Restore the original ReactFlow zoom/pan transform immediately
            flowElement.style.transform = transform;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`logic-schema-${synthesisTarget}-${Date.now()}.pdf`);
        } catch (err) {
            console.error('Failed to export PDF', err);
        }
    };

    return (
        <div className="home-container">
            {/* Background 3D Scene */}
            <div className="spline-background">
                <Suspense fallback={<div className="spline-loader"><div className="spinner" /></div>}>
                    <CubesScene />
                </Suspense>
            </div>

            {/* Front-layer UI */}
            <div className="glass-overlay" style={{ overflowY: 'auto' }}>
                <header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>The <span style={{ color: "var(--accent-color)" }}>Silicon</span> Brain</h1>
                    <div className="nav-tabs" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: '8px' }}>
                        <button
                            style={{ background: activeTab === 'solver' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'solver' ? '#000' : 'var(--text-color)', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit' }}
                            onClick={() => setActiveTab('solver')}
                        >
                            Solver
                        </button>
                        <button
                            style={{ background: activeTab === 'math' ? 'var(--accent-color)' : 'transparent', color: activeTab === 'math' ? '#000' : 'var(--text-color)', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit' }}
                            onClick={() => setActiveTab('math')}
                        >
                            Mathematical Model
                        </button>
                    </div>
                </header>

                <main className="home-main" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
                    {activeTab === 'solver' && (
                        <section className="solver-section glass-panel">
                            <div className="solver-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.5rem' }}>
                                    <Cpu className="icon" size={24} color="var(--accent-color)" /> Synthesizer
                                </h2>
                                <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: "var(--text-color-muted)" }}>
                                    <Activity size={16} color={isComputing ? "#00d2ff" : "var(--text-color-muted)"} />
                                    {isComputing ? 'Processing...' : 'Awaiting Input'}
                                </div>
                            </div>

                            <div className="input-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

                                {/* Variable Count */}
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label htmlFor="varCount" style={{ fontSize: '0.85rem', color: 'var(--text-color-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Number of Variables</label>
                                    <select id="varCount" className="styled-input" value={varCount} onChange={(e) => setVarCount(e.target.value)}>
                                        <option value="2">2 Variables (A, B)</option>
                                        <option value="3">3 Variables (A, B, C)</option>
                                        <option value="4">4 Variables (A, B, C, D)</option>
                                        <option value="5">5 Variables (A-E)</option>
                                        <option value="6">6 Variables (A-F)</option>
                                        <option value="8">8 Variables (A-H)</option>
                                        <option value="16">16 Variables (A-P)</option>
                                    </select>
                                </div>

                                {/* Min / Max Term Toggle */}
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-color-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Term Type</label>
                                    <div className="term-type-toggle">
                                        <button
                                            className={termType === 'min' ? 'active' : ''}
                                            onClick={() => { setTermType('min'); setResult(null); }}
                                        >
                                            Σ Minterms
                                        </button>
                                        <button
                                            className={termType === 'max' ? 'active' : ''}
                                            onClick={() => { setTermType('max'); setResult(null); }}
                                        >
                                            Π Maxterms
                                        </button>
                                    </div>
                                </div>

                                {/* Term input */}
                                <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label htmlFor="minterms" style={{ fontSize: '0.85rem', color: 'var(--text-color-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {termType === 'min' ? 'Minterms (Σm)' : 'Maxterms (ΠM)'}
                                    </label>
                                    <input
                                        id="minterms"
                                        className="styled-input"
                                        type="text"
                                        value={minterms}
                                        onChange={(e) => setMinterms(e.target.value)}
                                        placeholder={termType === 'min' ? 'e.g. 0, 1, 3, 7' : 'e.g. 2, 4, 5, 6'}
                                        onKeyDown={(e) => e.key === 'Enter' && handleOptimize()}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-color-muted)', margin: 0 }}>
                                        {termType === 'min'
                                            ? `Enter minterm indices (0 to ${Math.pow(2, parseInt(varCount, 10)) - 1})`
                                            : `Enter maxterm indices (0 to ${Math.pow(2, parseInt(varCount, 10)) - 1})`}
                                    </p>
                                </div>

                                <button
                                    className="contact-btn"
                                    onClick={handleOptimize}
                                    disabled={isComputing}
                                    style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                                >
                                    <Zap size={18} /> {isComputing ? 'Synthesizing...' : 'Optimize Logic'}
                                </button>
                            </div>

                            <div className="result-display" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 500 }}>Optimized Boolean Expression</h3>
                                <div className="expression-box" style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                                    {result ? (
                                        <span className={result.startsWith('Error') ? 'error-text' : ''} style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: result.startsWith('Error') ? '#ff4d4d' : '#00d2ff', letterSpacing: '1px', wordBreak: 'break-all' }}>
                                            {result}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--text-color-muted)', fontStyle: 'italic' }}>Awaiting synthesis...</span>
                                    )}
                                </div>

                                {result && !result.startsWith('Error') && (
                                    <div className="hdl-code-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        <div className="hdl-box" style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'var(--text-color-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>Verilog</span>
                                                <button
                                                    onClick={() => handleCopy(generateVerilog(result, activeNumVars), 'verilog')}
                                                    style={{ background: 'transparent', border: 'none', color: copiedIndicator === 'verilog' ? '#7ee787' : 'var(--text-color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', transition: 'color 0.2s', padding: 0 }}
                                                    title="Copy Verilog"
                                                >
                                                    {copiedIndicator === 'verilog' ? <Check size={14} /> : <Copy size={14} />}
                                                    {copiedIndicator === 'verilog' ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto', fontSize: '0.9rem', color: '#a5d6ff', fontFamily: 'monospace' }}>
                                                {generateVerilog(result, activeNumVars)}
                                            </pre>
                                        </div>
                                        <div className="hdl-box" style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'var(--text-color-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>SystemVerilog</span>
                                                <button
                                                    onClick={() => handleCopy(generateSystemVerilog(result, activeNumVars), 'systemverilog')}
                                                    style={{ background: 'transparent', border: 'none', color: copiedIndicator === 'systemverilog' ? '#7ee787' : 'var(--text-color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', transition: 'color 0.2s', padding: 0 }}
                                                    title="Copy SystemVerilog"
                                                >
                                                    {copiedIndicator === 'systemverilog' ? <Check size={14} /> : <Copy size={14} />}
                                                    {copiedIndicator === 'systemverilog' ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto', fontSize: '0.9rem', color: '#7ee787', fontFamily: 'monospace' }}>
                                                {generateSystemVerilog(result, activeNumVars)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {result && !result.startsWith('Error') && result !== '1' && result !== '0' && (
                                    <>
                                        <KMapVisualizer minterms={activeMinterms} numVars={activeNumVars} />
                                        <button onClick={() => setIsModalOpen(true)} className="generate-diagram-btn">
                                            <Maximize2 size={18} /> Open Interactive Logic Builder
                                        </button>
                                    </>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'math' && (
                        <MathModel />
                    )}
                </main>
            </div>

            {/* Fullscreen Interactive React-Flow Layout Modal */}
            {isModalOpen && (
                <div className="diagram-modal-overlay">
                    <div className="diagram-modal">
                        <div className="modal-toolbar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>Circuit Schematic</h2>

                                {/* New Synthesis Target Dropdown */}
                                <select
                                    style={{ marginLeft: '1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '4px', fontFamily: 'monospace' }}
                                    value={synthesisTarget}
                                    onChange={(e) => setSynthesisTarget(e.target.value)}
                                >
                                    <option value="standard" style={{ color: 'black' }}>Standard (AND / OR)</option>
                                    <option value="nand" style={{ color: 'black' }}>Universal (NAND-Only)</option>
                                    <option value="nor" style={{ color: 'black' }}>Universal (NOR-Only)</option>
                                </select>

                                <div className="theme-toggle">
                                    <button className={diagramTheme === 'light' ? 'active' : ''} onClick={() => setDiagramTheme('light')}><Sun size={14} /></button>
                                    <button className={diagramTheme === 'dark' ? 'active' : ''} onClick={() => setDiagramTheme('dark')}><Moon size={14} /></button>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button onClick={exportToImage} className="toolbar-btn primary"><ImageIcon size={16} /> Image</button>
                                <button onClick={exportToPDF} className="toolbar-btn primary"><Download size={16} /> PDF</button>
                                <button onClick={() => setIsModalOpen(false)} className="toolbar-btn close"><X size={20} /></button>
                            </div>
                        </div>
                        <div className="modal-canvas-container" data-theme={diagramTheme} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1rem', paddingBottom: '0', textAlign: 'center', background: diagramTheme === 'dark' ? '#101827' : '#ffffff', zIndex: 10 }}>
                                <h1 style={{ color: diagramTheme === 'dark' ? '#00d2ff' : '#005bb5', fontFamily: 'monospace', fontSize: '1.5rem', margin: 0, wordBreak: 'break-all' }}>
                                    Y = {result}
                                </h1>
                            </div>
                            {/* ReactFlow Canvas Mounts Here */}
                            <LogicGateVisualizer expression={result} theme={diagramTheme} synthesisTarget={synthesisTarget} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
