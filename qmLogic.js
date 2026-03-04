// The Quine-McCluskey solver logic implementation
function solveQM(mintermsStr, forcedNumVars = "auto") {
    try {
        const minterms = mintermsStr.split(',')
            .map(m => m.trim())
            .filter(m => m !== '')
            .map(m => parseInt(m, 10));

        if (minterms.length === 0) return null;

        // Validate minterms
        for (let m of minterms) {
            if (isNaN(m) || m < 0) {
                return "Error: Invalid Input - Must be positive integers";
            }
        }

        // --- Step 1: Initialization ---
        // Find the maximum number of bits needed to represent the largest minterm
        const maxMinterm = Math.max(...minterms);
        let numVars = Math.max(1, Math.ceil(Math.log2(maxMinterm + 1)));

        if (forcedNumVars !== "auto") {
            const parsedForced = parseInt(forcedNumVars, 10);
            if (!isNaN(parsedForced) && parsedForced >= numVars) {
                numVars = parsedForced;
            } else if (parsedForced < numVars) {
                return `Error: Minterm ${maxMinterm} requires at least ${numVars} variables.`;
            }
        }

        // Create initial implicants
        let implicants = minterms.map(m => ({
            minterms: [m],
            bin: m.toString(2).padStart(numVars, '0'),
            isCovered: false
        }));

        // --- Step 2: Combine Implicants ---
        let primeImplicants = [];
        let grouped = groupByOnes(implicants);
        let hasCombined = true;

        while (hasCombined) {
            hasCombined = false;
            const nextGrouped = [];
            const nextImplicantsSet = new Set();

            for (let i = 0; i < grouped.length - 1; i++) {
                const groupA = grouped[i];
                const groupB = grouped[i + 1];
                const currentNextGroup = [];

                for (let a of groupA) {
                    for (let b of groupB) {
                        const diffIndex = getDifference(a.bin, b.bin);
                        if (diffIndex !== -1) {
                            a.isCovered = true;
                            b.isCovered = true;
                            const newBin = a.bin.substring(0, diffIndex) + '-' + a.bin.substring(diffIndex + 1);

                            if (!nextImplicantsSet.has(newBin)) {
                                nextImplicantsSet.add(newBin);
                                currentNextGroup.push({
                                    minterms: [...a.minterms, ...b.minterms].sort((x, y) => x - y),
                                    bin: newBin,
                                    isCovered: false
                                });
                                hasCombined = true;
                            }
                        }
                    }
                }
                if (currentNextGroup.length > 0) {
                    nextGrouped.push(currentNextGroup);
                }
            }

            // Extract prime implicants from current grouped
            for (const group of grouped) {
                for (const term of group) {
                    if (!term.isCovered) {
                        primeImplicants.push(term);
                    }
                }
            }

            grouped = nextGrouped;
        }

        // Add any remaining uncovered implicants from the last group
        for (const group of grouped) {
            for (const term of group) {
                if (!term.isCovered) {
                    primeImplicants.push(term);
                }
            }
        }

        // Filter duplicates in Prime Implicants
        const uniquePIsMap = new Map();
        for (const pi of primeImplicants) {
            uniquePIsMap.set(pi.bin, pi);
        }
        primeImplicants = Array.from(uniquePIsMap.values());

        // --- Step 3: Prime Implicant Chart ---
        // Create a chart showing which PI covers which minterm
        const chart = {};
        for (const m of minterms) {
            chart[m] = [];
            for (let i = 0; i < primeImplicants.length; i++) {
                if (primeImplicants[i].minterms.includes(m)) {
                    chart[m].push(i);
                }
            }
        }

        // Find Essential Prime Implicants
        const essentialPIs = [];
        const coveredMinterms = new Set();

        for (const m of minterms) {
            if (chart[m].length === 1) {
                const piIndex = chart[m][0];
                if (!essentialPIs.includes(primeImplicants[piIndex])) {
                    essentialPIs.push(primeImplicants[piIndex]);

                    // Mark all minterms covered by this EPI as covered
                    for (const coveredByEpi of primeImplicants[piIndex].minterms) {
                        coveredMinterms.add(coveredByEpi);
                    }
                }
            }
        }

        // For this basic version, we will just use the Essential Prime Implicants 
        // and add remaining minimum Prime Implicants to cover the rest.
        // A complete Petrick's Method implementation is more complex, but a greedy approach works for many circuits.
        const remainingPIs = primeImplicants.filter(pi => !essentialPIs.includes(pi));

        let finalExpressionTerms = [...essentialPIs];

        // Greedy approach for remaining minterms
        let uncovered = minterms.filter(m => !coveredMinterms.has(m));

        while (uncovered.length > 0) {
            // Find PI that covers the most uncovered minterms
            let bestPI = null;
            let maxCover = 0;

            for (const pi of remainingPIs) {
                const coverCount = pi.minterms.filter(m => uncovered.includes(m)).length;
                if (coverCount > maxCover) {
                    maxCover = coverCount;
                    bestPI = pi;
                }
            }

            if (bestPI) {
                finalExpressionTerms.push(bestPI);
                for (const m of bestPI.minterms) {
                    coveredMinterms.add(m);
                }
                uncovered = minterms.filter(m => !coveredMinterms.has(m));
            } else {
                break; // Safety break
            }
        }

        // --- Step 4: Convert to Boolean Expression ---
        if (finalExpressionTerms.length === 0) return "0";
        if (finalExpressionTerms[0].bin.indexOf('0') === -1 && finalExpressionTerms[0].bin.indexOf('1') === -1) return "1";

        const variables = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        const booleanExpr = finalExpressionTerms.map(term => {
            let part = "";
            for (let i = 0; i < term.bin.length; i++) {
                if (term.bin[i] === '1') {
                    part += variables[i];
                } else if (term.bin[i] === '0') {
                    part += variables[i] + "'";
                }
            }
            return part;
        }).join(" + ");

        return booleanExpr;

    } catch (error) {
        console.error(error);
        return "Error: " + error.message;
    }
}

// Helper functions
function groupByOnes(implicants) {
    const grouped = [];
    for (const imp of implicants) {
        let ones = 0;
        for (let i = 0; i < imp.bin.length; i++) {
            if (imp.bin[i] === '1') ones++;
        }
        if (!grouped[ones]) grouped[ones] = [];
        grouped[ones].push(imp);
    }
    // Convert sparse array to dense array for easier iteration
    return Object.keys(grouped).sort((a, b) => a - b).map(k => grouped[k]);
}

function getDifference(bin1, bin2) {
    let diffCount = 0;
    let diffIndex = -1;
    for (let i = 0; i < bin1.length; i++) {
        if (bin1[i] !== bin2[i]) {
            diffCount++;
            diffIndex = i;
        }
    }
    return diffCount === 1 ? diffIndex : -1;
}
