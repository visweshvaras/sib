const fs = require('fs');
try {
    const content = fs.readFileSync('src/App.css', 'utf8');
    const lines = content.split(/\r?\n/);
    const cleanedLines = lines.slice(0, 405);
    const fixedCSS = `/* K-Map Styles */
.kmap-container {
    background: rgba(10, 15, 30, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.kmap-container.fallback {
    text-align: center;
    padding: 2rem;
}

.kmap-scroll-wrapper {
    overflow-x: auto;
    padding-bottom: 0.5rem;
}

.kmap-table {
    border-collapse: collapse;
    margin: 0 auto;
    font-family: monospace;
}

.kmap-table th, .kmap-table td {
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    padding: 0;
}

.kmap-table th {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-color-muted);
    font-weight: 600;
    padding: 0.5rem;
    font-size: 0.9rem;
}

.kmap-cell {
    width: 60px;
    height: 60px;
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.kmap-cell:hover {
    background: rgba(255, 255, 255, 0.05);
}

.kmap-cell.active-cell {
    background: rgba(0, 210, 255, 0.15);
    border-color: rgba(0, 210, 255, 0.4);
}

.kmap-cell.active-cell .cell-value {
    color: #00d2ff;
    text-shadow: 0 0 8px rgba(0, 210, 255, 0.5);
    font-weight: bold;
}

.cell-value {
    font-size: 1.5rem;
    color: var(--text-color);
}

.minterm-index {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
}

.diagonal-header {
    position: relative;
    min-width: 60px;
    min-height: 60px;
}

.split-cell {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Simulate diagonal line using a pseudo-element */
.diagonal-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    transform: rotate(38deg);
    transform-origin: top left;
    z-index: 1;
}

.split-cell .bottom-left {
    position: absolute;
    bottom: 4px;
    left: 4px;
    font-size: 0.8rem;
}

.split-cell .top-right {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.8rem;
}
`;
    fs.writeFileSync('src/App.css', cleanedLines.join('\n') + '\n' + fixedCSS);
    console.log('App.css successfully fixed!');
} catch (e) {
    console.error(e);
}
