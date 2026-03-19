export function generateVerilog(expression, numVars) {
    if (!expression || expression.startsWith('Error')) return "";

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const inputs = letters.substring(0, numVars).split('').join(', ');
    
    let parsedExpression = expression;
    if (expression === "1") {
        parsedExpression = "1'b1";
    } else if (expression === "0") {
        parsedExpression = "1'b0";
    } else {
        const terms = expression.split('+').map(t => t.trim());
        const parsedTerms = terms.map(term => {
            let expr = [];
            for (let i = 0; i < term.length; i++) {
                if (term[i].match(/[A-Z]/)) {
                    let inverted = false;
                    if (i + 1 < term.length && term[i+1] === "'") {
                        inverted = true;
                    }
                    if (inverted) {
                        expr.push(`~${term[i]}`);
                    } else {
                        expr.push(`${term[i]}`);
                    }
                }
            }
            return `(${expr.join(' & ')})`;
        });
        parsedExpression = parsedTerms.join(' | ');
    }

    return `module logic_circuit(
    input wire ${inputs},
    output wire Y
);

    assign Y = ${parsedExpression};

endmodule`;
}

export function generateSystemVerilog(expression, numVars) {
    if (!expression || expression.startsWith('Error')) return "";

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const inputs = letters.substring(0, numVars).split('').join(', ');
    
    let parsedExpression = expression;
    if (expression === "1") {
        parsedExpression = "1'b1";
    } else if (expression === "0") {
        parsedExpression = "1'b0";
    } else {
        const terms = expression.split('+').map(t => t.trim());
        const parsedTerms = terms.map(term => {
            let expr = [];
            for (let i = 0; i < term.length; i++) {
                if (term[i].match(/[A-Z]/)) {
                    let inverted = false;
                    if (i + 1 < term.length && term[i+1] === "'") {
                        inverted = true;
                    }
                    if (inverted) {
                        expr.push(`~${term[i]}`);
                    } else {
                        expr.push(`${term[i]}`);
                    }
                }
            }
            return `(${expr.join(' & ')})`;
        });
        parsedExpression = parsedTerms.join(' | ');
    }

    return `module logic_circuit(
    input logic ${inputs},
    output logic Y
);

    always_comb begin
        Y = ${parsedExpression};
    end

endmodule`;
}
