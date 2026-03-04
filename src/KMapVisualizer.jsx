import React from 'react';

const KMapVisualizer = ({ minterms, numVars }) => {
    // We only support 2, 3, or 4 variables for standard visual K-Maps.
    if (![2, 3, 4].includes(numVars)) {
        return (
            <div className="kmap-container fallback">
                <p>K-Map visualization is currently optimized for 2, 3, and 4 variables.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-color-muted)' }}>
                    Your {numVars}-variable expression was synthesized successfully, but the grid is too large to render simply.
                </p>
            </div>
        );
    }

    const mintermSet = new Set(minterms);

    // Gray code sequences for axes
    const grayCode2 = ['0', '1'];
    const grayCode4 = ['00', '01', '11', '10'];

    let rows, cols;
    let rowVars, colVars;

    if (numVars === 2) {
        // A \ B
        rows = grayCode2;
        cols = grayCode2;
        rowVars = 'A';
        colVars = 'B';
    } else if (numVars === 3) {
        // A \ BC
        rows = grayCode2;
        cols = grayCode4;
        rowVars = 'A';
        colVars = 'BC';
    } else if (numVars === 4) {
        // AB \ CD
        rows = grayCode4;
        cols = grayCode4;
        rowVars = 'AB';
        colVars = 'CD';
    }

    const getCellMinterm = (row, col) => {
        // Combine row and col gray codes
        const binaryString = row + col;
        // Parse as integer
        return parseInt(binaryString, 2);
    };

    return (
        <div className="kmap-container glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                <span>Karnaugh Map</span>
                <span style={{ color: 'var(--text-color-muted)', fontSize: '0.85rem' }}>{numVars} Variables ({rowVars}\{colVars})</span>
            </h3>

            <div className="kmap-scroll-wrapper" style={{ overflowX: 'auto' }}>
                <table className="kmap-table">
                    <thead>
                        <tr>
                            <th className="diagonal-header">
                                <div className="split-cell">
                                    <span className="bottom-left">{rowVars}</span>
                                    <span className="top-right">{colVars}</span>
                                </div>
                            </th>
                            {cols.map((colVal) => (
                                <th key={colVal} className="col-header">{colVal}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((rowVal) => (
                            <tr key={rowVal}>
                                <th className="row-header">{rowVal}</th>
                                {cols.map((colVal) => {
                                    const mIndex = getCellMinterm(rowVal, colVal);
                                    const isOne = mintermSet.has(mIndex);
                                    return (
                                        <td key={colVal} className={`kmap-cell ${isOne ? 'active-cell' : ''}`}>
                                            <span className="cell-value">{isOne ? '1' : '0'}</span>
                                            <span className="minterm-index">m{mIndex}</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KMapVisualizer;
