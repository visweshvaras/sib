import React from 'react';

export function MathModel() {
    return (
        <section className="math-model-section glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.8rem', color: 'var(--text-color)' }}>
                Mathematical Model
            </h2>

            <div className="math-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.6', color: 'var(--text-color-muted)' }}>

                {/* Section 1: Core Concepts */}
                <div className="math-part" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>Core Concepts</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ color: '#fff' }}>1. Boolean Algebra</strong>
                        <p style={{ margin: '0.5rem 0' }}>The mathematical foundation of digital logic, utilizing operations such as conjunction (AND), disjunction (OR), and negation (NOT).</p>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--accent-color)' }}>
                            <em>Example:</em> If <code>A = 1</code> (True) and <code>B = 0</code> (False), then <code>A AND B = 0</code>.
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ color: '#fff' }}>2. Karnaugh Maps (K-Maps)</strong>
                        <p style={{ margin: '0.5rem 0' }}>A visual, grid-based mathematical method used to simplify Boolean algebra expressions, allowing engineers to identify the optimal grouping of logic states.</p>

                        {/* K-Map Illustration */}
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid #00d2ff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p style={{ margin: '0 0 1rem 0' }}><em>Illustration: A 2-Variable K-Map (Example)</em></p>
                            <table style={{ borderCollapse: 'collapse', textAlign: 'center', background: '#1a202c', color: '#fff', width: '220px', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: '#2d3748' }}>A \ B</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: '#2d3748' }}><strong>0</strong> (B')</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: '#2d3748' }}><strong>1</strong> (B)</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: '#2d3748' }}><strong>0</strong> (A')</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: 'rgba(0, 210, 255, 0.2)' }}>1</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem' }}>0</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: '#2d3748' }}><strong>1</strong> (A)</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: 'rgba(0, 210, 255, 0.2)' }}>1</td>
                                        <td style={{ border: '1px solid #4a5568', padding: '0.5rem', background: 'rgba(0, 210, 255, 0.2)' }}>1</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', textAlign: 'center' }}>
                                Grouping the 1s vertically (A'B' and AB') gives <strong>B'</strong>.<br />
                                Grouping horizontally (AB' and AB) gives <strong>A</strong>.<br />
                                <em>Simplified Equation:</em> <code style={{ color: '#00d2ff' }}>F = A + B'</code>
                            </p>
                        </div>
                    </div>

                    <div>
                        <strong style={{ color: '#fff' }}>3. De Morgan's Laws</strong>
                        <p style={{ margin: '0.5rem 0' }}>Transformation rules that are vital for reducing the variety of logic gates needed in a physical circuit (e.g., converting AND/OR logic strictly into NAND/NOR logic for silicon manufacturing).</p>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--accent-color)' }}>
                            <em>Example:</em> <code>NOT (A AND B)</code> is equivalent to <code>(NOT A) OR (NOT B)</code>.<br />
                            In math: <code style={{ color: '#00d2ff' }}>(A · B)' = A' + B'</code>
                        </div>
                    </div>
                </div>

                {/* Section 2: Core Equations */}
                <div className="math-part" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>Core Equations (Boolean Theorems)</h3>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <strong style={{ color: '#e2e8f0' }}>Sum of Products (SOP):</strong> This is how the app reads the "on" cells from the grid: <code style={{ color: '#00d2ff' }}>F = Σm</code>
                        </li>
                        <li>
                            <strong style={{ color: '#e2e8f0' }}>Logical Adjacency:</strong> The math behind grouping terms and cutting out extra variables, like in <code style={{ color: '#00d2ff' }}>A·B + A·B' = A</code>
                        </li>
                        <li>
                            <strong style={{ color: '#e2e8f0' }}>De Morgan’s Laws:</strong> These help clean up the circuit design, for example: <code style={{ color: '#00d2ff' }}>(A·B)' = A' + B'</code>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Quine-McCluskey Solved Example */}
                <div className="math-part" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>Quine-McCluskey Solved Example</h3>
                    <p style={{ marginBottom: '1rem', color: '#e2e8f0' }}>Let's simplify a 3-variable function for <code style={{ color: '#00d2ff' }}>F(A, B, C) = Σm(0, 2, 4, 6)</code></p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px' }}>
                            <strong style={{ color: '#00d2ff', display: 'block', marginBottom: '0.5rem' }}>Step 1: Convert to Binary & Group</strong>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontFamily: 'monospace' }}>
                                <li>0: 000 (0 ones)</li>
                                <li>2: 010 (1 one)</li>
                                <li>4: 100 (1 one)</li>
                                <li>6: 110 (2 ones)</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px' }}>
                            <strong style={{ color: '#00d2ff', display: 'block', marginBottom: '0.5rem' }}>Step 2: Combine Groups (Differ by 1 bit)</strong>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontFamily: 'monospace' }}>
                                <li>(0,2): 0-0</li>
                                <li>(0,4): -00</li>
                                <li>(2,6): -10</li>
                                <li>(4,6): 1-0</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px' }}>
                            <strong style={{ color: '#00d2ff', display: 'block', marginBottom: '0.5rem' }}>Step 3: Combine Again</strong>
                            <p style={{ margin: '0 0 0.5rem 0' }}>Combining (0,2) and (4,6), the bits differ again to produce:</p>
                            <div style={{ fontFamily: 'monospace', paddingLeft: '1.5rem' }}>--0 (Covers 0, 2, 4, 6)</div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-color-muted)' }}><em>The "-" means those variables are eliminated.</em></p>
                        </div>

                        <div style={{ background: 'rgba(0,210,255,0.1)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #00d2ff' }}>
                            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Final Result</strong>
                            <p style={{ margin: 0 }}>
                                Since <strong><code style={{ color: '#fff' }}>--0</code></strong> corresponds to the variables <strong>A, B, C</strong> where A and B are eliminated (-), and C is 0 (NOT C), the final equation is:
                                <br /><br />
                                <strong style={{ fontSize: '1.2rem', color: '#00d2ff' }}>F = C'</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 4: How the Code Works */}
                <div className="math-part" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>How the Code Actually Works</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📥</div>
                            <strong style={{ color: '#fff' }}>Input Reading</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>The app checks out your K-map grid and grabs every spot marked "1".</p>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
                            <strong style={{ color: '#fff' }}>Algorithmic Grouping</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>It runs a reduction algorithm (Quine-McCluskey) that finds and groups all the neighboring 1s, squeezing things down to the simplest Boolean expression possible.</p>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
                            <strong style={{ color: '#fff' }}>Visual Translation</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Once it's got the final simplified equation, the system draws out the right logic gates (AND, OR, NOT) for you, right on your screen.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
