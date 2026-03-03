// Quine-McCluskey Logic Synthesizer Implementation
// Converts minterms into optimized boolean expressions.

export function solveQM(mintermsStr, numVars = 4) {
    try {
        const minterms = mintermsStr.split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m, 10));

        if (minterms.length === 0) return null;

        for (let m of minterms) {
            if (isNaN(m) || m < 0 || m >= Math.pow(2, numVars)) {
                return `Error: Invalid minterm '${m}' for ${numVars} variables.`;
            }
        }

        // Quick optimization for full coverage
        if (minterms.length === Math.pow(2, numVars)) {
            return "1"; // Constant True
        }

        const optimizedTerms = quineMcCluskey(minterms, numVars);

        if (optimizedTerms.length === 0) return "0";

        return formatExpression(optimizedTerms, numVars);

    } catch (error) {
        return "Error: Invalid Input - " + error.message;
    }
}

// Helpers for the QM algorithm
function countOnes(binaryStr) {
    return binaryStr.split('1').length - 1;
}

function toBinaryString(num, padding) {
    return num.toString(2).padStart(padding, '0');
}

function differByOneCharacter(str1, str2) {
    let diffCount = 0;
    let diffIndex = -1;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            diffCount++;
            diffIndex = i;
        }
    }
    return diffCount === 1 ? diffIndex : -1;
}

// Basic Quine-McCluskey implementation
function quineMcCluskey(minterms, numVars) {
    let groups = {};

    // Step 1: Initial grouping
    for (let m of minterms) {
        let binStr = toBinaryString(m, numVars);
        let ones = countOnes(binStr);
        if (!groups[ones]) groups[ones] = [];
        groups[ones].push({ term: binStr, source: [m], used: false });
    }

    let primeImplicants = [];
    let currentGroups = groups;
    let anyCombined = true;

    // Step 2: Combine terms
    while (anyCombined) {
        anyCombined = false;
        let nextGroups = {};

        for (let i = 0; i <= numVars; i++) {
            if (!currentGroups[i]) continue;
            for (let j = i + 1; j <= numVars; j++) {
                if (!currentGroups[j] || j !== i + 1) continue;

                for (let t1 of currentGroups[i]) {
                    for (let t2 of currentGroups[j]) {
                        let diffIndex = differByOneCharacter(t1.term, t2.term);
                        if (diffIndex !== -1) {
                            anyCombined = true;
                            t1.used = true;
                            t2.used = true;

                            let combinedTerm = t1.term.substring(0, diffIndex) + '-' + t1.term.substring(diffIndex + 1);
                            let combinedSource = [...t1.source, ...t2.source];
                            combinedSource.sort((a, b) => a - b);

                            let ones = countOnes(combinedTerm);
                            if (!nextGroups[ones]) nextGroups[ones] = [];

                            // Prevent duplicates
                            let exists = nextGroups[ones].some(t => t.term === combinedTerm);
                            if (!exists) {
                                nextGroups[ones].push({ term: combinedTerm, source: combinedSource, used: false });
                            }
                        }
                    }
                }
            }
        }

        // Add unused terms to prime implicants
        for (let i in currentGroups) {
            for (let t of currentGroups[i]) {
                if (!t.used) {
                    let exists = primeImplicants.some(pi => pi.term === t.term);
                    if (!exists) primeImplicants.push(t);
                }
            }
        }

        currentGroups = nextGroups;
    }

    // Phase 3: Petrick's Method / Essential Prime Implicant Extraction (Simplified Greedy for Web Demo)
    let essential = [];
    let coveredMinterms = new Set();

    // Sort logic to prefer larger implicants covering more minterms
    primeImplicants.sort((a, b) => b.source.length - a.source.length);

    // Find actual essentials
    for (let m of minterms) {
        let coveringPIs = primeImplicants.filter(pi => pi.source.includes(m));
        if (coveringPIs.length === 1) {
            if (!essential.some(e => e.term === coveringPIs[0].term)) {
                essential.push(coveringPIs[0]);
                coveringPIs[0].source.forEach(s => coveredMinterms.add(s));
            }
        }
    }

    // Greedy cover remaining
    for (let pi of primeImplicants) {
        let newCovers = pi.source.filter(s => !coveredMinterms.has(s));
        if (newCovers.length > 0) {
            let exists = essential.some(e => e.term === pi.term);
            if (!exists) {
                essential.push(pi);
                pi.source.forEach(s => coveredMinterms.add(s));
            }
        }
    }

    return essential.map(e => e.term);
}

// Convert '-101' to A' B C D, etc.
function formatExpression(terms, numVars) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let formatted = [];

    for (let term of terms) {
        let termStr = "";
        for (let i = 0; i < term.length; i++) {
            if (term[i] === '1') {
                termStr += letters[i];
            } else if (term[i] === '0') {
                termStr += letters[i] + "'";
            }
        }
        if (termStr === "") termStr = "1"; // Handle don't care everything
        formatted.push(termStr);
    }

    return formatted.join(" + ");
}
