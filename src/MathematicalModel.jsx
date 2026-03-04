import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function MathematicalModel() {
  const [expandedSections, setExpandedSections] = useState({
    gates: true,
    qm: true,
    simulation: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="mathematical-model" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Mathematical Model & Formal Verification</h1>
      
      {/* Boolean Logic Gates Section */}
      <Section 
        title="1. Boolean Logic Gates"
        expanded={expandedSections.gates}
        onToggle={() => toggleSection('gates')}
      >
        <div style={{ marginBottom: '30px' }}>
          <h3>Fundamental Boolean Operations</h3>
          <p>All digital logic can be expressed using three basic operations:</p>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>AND Operation</h4>
            <BlockMath math="A \land B = \begin{cases} 1 & \text{if } A=1 \text{ and } B=1 \\ 0 & \text{otherwise} \end{cases}" />
            <TruthTable 
              title="Truth Table for AND"
              rows={[
                { inputs: 'A, B', output: 'A ∧ B' },
                { inputs: '0, 0', output: '0' },
                { inputs: '0, 1', output: '0' },
                { inputs: '1, 0', output: '0' },
                { inputs: '1, 1', output: '1' }
              ]}
            />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>OR Operation</h4>
            <BlockMath math="A \lor B = \begin{cases} 1 & \text{if } A=1 \text{ or } B=1 \text{ or both} \\ 0 & \text{otherwise} \end{cases}" />
            <TruthTable 
              title="Truth Table for OR"
              rows={[
                { inputs: 'A, B', output: 'A ∨ B' },
                { inputs: '0, 0', output: '0' },
                { inputs: '0, 1', output: '1' },
                { inputs: '1, 0', output: '1' },
                { inputs: '1, 1', output: '1' }
              ]}
            />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>NOT Operation</h4>
            <BlockMath math="\neg A = \begin{cases} 1 & \text{if } A=0 \\ 0 & \text{if } A=1 \end{cases}" />
            <TruthTable 
              title="Truth Table for NOT"
              rows={[
                { inputs: 'A', output: '¬A' },
                { inputs: '0', output: '1' },
                { inputs: '1', output: '0' }
              ]}
            />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4>Derived Operations</h4>
            <BlockMath math="A \oplus B = (A \land \neg B) \lor (\neg A \land B) \quad \text{(XOR)}" />
            <BlockMath math="\overline{A \land B} = \neg A \lor \neg B \quad \text{(NAND - De Morgan's Law)}" />
            <BlockMath math="\overline{A \lor B} = \neg A \land \neg B \quad \text{(NOR - De Morgan's Law)}" />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Boolean Algebra Properties</h3>
          <div style={{ padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
            <ul>
              <li><strong>Identity:</strong> <InlineMath math="A \lor 0 = A" />, <InlineMath math="A \land 1 = A" /></li>
              <li><strong>Domination:</strong> <InlineMath math="A \lor 1 = 1" />, <InlineMath math="A \land 0 = 0" /></li>
              <li><strong>Idempotence:</strong> <InlineMath math="A \lor A = A" />, <InlineMath math="A \land A = A" /></li>
              <li><strong>Double Negation:</strong> <InlineMath math="\neg(\neg A) = A" /></li>
              <li><strong>Commutativity:</strong> <InlineMath math="A \lor B = B \lor A" />,  <InlineMath math="A \land B = B \land A" /></li>
              <li><strong>Associativity:</strong> <InlineMath math="(A \lor B) \lor C = A \lor (B \lor C)" /></li>
              <li><strong>Distributivity:</strong> <InlineMath math="A \land (B \lor C) = (A \land B) \lor (A \land C)" /></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Quine-McCluskey Algorithm */}
      <Section 
        title="2. Quine-McCluskey Boolean Minimization Algorithm"
        expanded={expandedSections.qm}
        onToggle={() => toggleSection('qm')}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3>Purpose</h3>
          <p>
            The Quine-McCluskey (QM) algorithm systematically finds the minimal Boolean expression 
            for a given set of minterms, reducing circuit complexity and hardware cost.
          </p>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Algorithm Steps</h3>
          
          <h4>Step 1: Initialization</h4>
          <p>Convert each minterm to binary representation and group by number of ones (Hamming weight):</p>
          <BlockMath math="m_k \rightarrow b_{n-1}b_{n-2}\cdots b_1b_0 \quad \text{where } n = \lceil \log_2(\max(m_i) + 1) \rceil" />
          <p><strong>Example:</strong> For minterms {1, 3, 5, 7} with 3 variables:</p>
          <TruthTable 
            title="Initial Minterm Grouping by Hamming Weight"
            rows={[
              { group: '0 ones', minterms: '—', binary: '—' },
              { group: '1 ones', minterms: '1, 2, 4', binary: '001, 010, 100' },
              { group: '2 ones', minterms: '3, 5, 6', binary: '011, 101, 110' },
              { group: '3 ones', minterms: '7', binary: '111' }
            ]}
          />

          <h4>Step 2: Combine Adjacent Implicants</h4>
          <p>Two implicants can combine if they differ in exactly one bit position:</p>
          <BlockMath math="\text{If } P_i \oplus P_j = \text{single bit power of 2, then } P_i \text{ and } P_j \text{ can combine}" />
          <p>The combination produces a term with don't-care (—) in the differing position.</p>
          <p><strong>Example:</strong></p>
          <div style={{ marginLeft: '20px', fontSize: '0.95em' }}>
            <p>001 and 011 differ only in position 1 → combine to 0-1</p>
            <p>001 and 101 differ only in position 2 → combine to -01</p>
          </div>

          <h4>Step 3: Iterate Until No New Combinations Possible</h4>
          <p>Mark all combined terms as covered. Repeat Step 2 with new terms until convergence:</p>
          <BlockMath math="\text{continue while } \exists \text{ uncovered implicants that can combine}" />

          <h4>Step 4: Prime Implicant Chart (Petrick's Algorithm)</h4>
          <p>Select minimal set of prime implicants that cover all original minterms:</p>
          <BlockMath math="\min \sum_{i} |PI_i| \quad \text{such that } \bigcup_i \text{minterms}(PI_i) = \text{all minterms}" />
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
          <h3>Implementation Complexity</h3>
          <ul>
            <li><strong>Time Complexity:</strong> <InlineMath math="O(2^n \cdot 2^{2^n})" /> in worst case</li>
            <li><strong>Space Complexity:</strong> <InlineMath math="O(2^n)" /> for implicant storage</li>
            <li><strong>Practical Use:</strong> Efficient for <InlineMath math="n \leq 10" /> variables</li>
          </ul>
        </div>
      </Section>

      {/* Logic Simulation */}
      <Section 
        title="3. Circuit Simulation Engine"
        expanded={expandedSections.simulation}
        onToggle={() => toggleSection('simulation')}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3>Topological Evaluation</h3>
          <p>The simulation engine evaluates circuit nodes in topological order to ensure correct data flow:</p>
          
          <BlockMath math="\text{For each node } n: \quad \text{output}(n) = f_{\text{gate}}(\text{inputs}(n))" />
          
          <h4>Algorithm:</h4>
          <ol>
            <li>Initialize input nodes with provided truth values</li>
            <li>Iteratively evaluate gate nodes: 
              <BlockMath math="\text{gate\_output} = \begin{cases} \text{AND}(i_1, i_2) & \text{if gate type is AND} \\ \text{OR}(i_1, i_2) & \text{if gate type is OR} \\ \neg i_1 & \text{if gate type is NOT} \end{cases}" />
            </li>
            <li>Propagate outputs to dependent nodes until convergence</li>
            <li>Check for cycles: <InlineMath math="\text{max iterations} = |\text{nodes}|" /></li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Correctness Invariants</h3>
          <ul>
            <li><strong>Acyclic Guarantee:</strong> Input validation prevents feedback loops</li>
            <li><strong>Deterministic Output:</strong> Same input always produces same output</li>
            <li><strong>Complete Evaluation:</strong> All reachable nodes receive values</li>
            <li><strong>Formal Semantics:</strong> Matches standard digital logic definitions</li>
          </ul>
        </div>
      </Section>

      {/* Formal Verification */}
      <Section 
        title="4. Formal Verification Framework"
        expanded={false}
        onToggle={() => toggleSection('verification')}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3>Verification Properties</h3>
          
          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
            <h4>1. Truth Table Consistency</h4>
            <BlockMath math="\forall \text{ input combinations } I: \quad \text{CIRCUIT}(I) = \text{TRUTH\_TABLE}(I)" />
          </div>

          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
            <h4>2. Boolean Minimization Correctness</h4>
            <BlockMath math="\text{Card}(\text{selected\_PIs}) = \min\{k : \bigcup^k \text{minterms}(PI_i) \supseteq \text{all minterms}\}" />
          </div>

          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
            <h4>3. Graph Acyclicity</h4>
            <p>Directed acyclic graph (DAG) property ensures:</p>
            <BlockMath math="\nexists \text{ cycle } C \text{ in graph } G" />
          </div>
        </div>
      </Section>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>References & Mathematical Foundations</h3>
        <ul>
          <li>Quine, W. V. (1952). "The Problem of Simplifying Truth Functions"</li>
          <li>McCluskey, E. J. (1956). "Minimization of Boolean Functions"</li>
          <li>Knuth, D. E. (1969). "The Art of Computer Programming, Volume 2"</li>
          <li>IEEE Standard 91-1984: Graphic Symbols for Logic Functions</li>
        </ul>
      </div>
    </div>
  );
}

function Section({ title, expanded, onToggle, children }) {
  return (
    <div style={{ marginBottom: '30px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          fontSize: '1.1em',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {title}
        {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {expanded && (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function TruthTable({ title, rows }) {
  return (
    <div style={{ margin: '15px 0' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{title}</p>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        fontSize: '0.95em'
      }}>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
              {Object.entries(row).map(([key, val]) => (
                <td 
                  key={key}
                  style={{
                    padding: '8px',
                    backgroundColor: idx === 0 ? '#e0e0e0' : 'white',
                    fontWeight: idx === 0 ? 'bold' : 'normal',
                    textAlign: 'center'
                  }}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
