# 🧠 Silicon Brain

> A Quine-McCluskey Boolean logic optimizer with interactive gate diagram visualization — built for VLSI chip design and digital logic learning.

![Silicon Brain](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=flat&logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

- **Quine-McCluskey Algorithm** — Minimizes Boolean expressions from minterms or maxterms (2–16 variables)
- **Interactive Logic Gate Diagram** — Drag-and-drop gates powered by React Flow
- **Live Signal Simulation** — Click input nodes (A, B, C...) to toggle 0/1 and watch signals propagate in real time
- **Universal Gate Synthesis** — Switch between Standard (AND/OR), NAND-Only, and NOR-Only implementations
- **Dark / Light Theme** — Toggle diagram themes on the fly
- **Export** — Download the circuit as a PNG image or PDF
- **3D Background** — Isometric cube grid rendered with Three.js and bloom post-processing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/silicon-brain.git
cd silicon-brain
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 🛠️ How to Use

1. **Select the number of variables** (2 to 16)
2. **Choose Minterms (Σm) or Maxterms (ΠM)**
3. **Enter the term indices** — e.g. `0, 1, 3, 7`
4. **Click "Optimize Logic"** — the minimized Boolean expression appears instantly
5. **Click "Open Interactive Logic Builder"** to view the gate diagram
6. **Click any input node** (A, B, C...) to toggle its value and see live signal propagation
7. **Switch synthesis mode** (Standard / NAND-Only / NOR-Only) from the toolbar
8. **Export** the diagram as PNG or PDF

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Logic Algorithm | Quine-McCluskey (custom implementation) |
| Gate Diagram | React Flow + Dagre (auto-layout) |
| 3D Scene | Three.js + React Three Fiber + Postprocessing |
| Export | html2canvas + jsPDF |
| Icons | Lucide React |
| Font | Outfit (Google Fonts) |

---

## 📁 Project Structure

```
silicon-brain/
├── public/
│   └── _redirects          # Cloudflare Pages SPA routing
├── src/
│   ├── App.jsx             # Main application, UI layout
│   ├── App.css             # Styles for glass panels, modal, toolbar
│   ├── index.css           # Global styles, CSS variables, fonts
│   ├── main.jsx            # React entry point
│   ├── qmLogic.js          # Quine-McCluskey algorithm
│   ├── LogicGraphBuilder.js # Builds node/edge graph from expression
│   ├── LogicSimulator.js   # Topological Boolean simulation engine
│   ├── LogicGateVisualizer.jsx # React Flow canvas with simulation
│   ├── GateNodes.jsx       # Custom SVG gate components
│   └── CubesScene.jsx      # Three.js isometric 3D background
├── index.html
├── vite.config.js
└── package.json
```

---

## ☁️ Deployment

### Cloudflare Pages
1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create a project** → Connect GitHub repo
3. Set build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Node version**: `18`
4. Deploy!

### Vercel
Vercel deployment is configured automatically via the `vercel.json` file included in this repository. This file ensures that Vercel clears its cache and correctly installs the required Linux binaries for `esbuild` and `rollup` before building.

1. Push your code to GitHub.
2. Import the repository in your Vercel dashboard.
3. Vercel will automatically detect Vite and use the `vercel.json` overrides to build and deploy the app successfully.

You can also deploy via CLI:
```bash
npx vercel --prod
```

---

## 📜 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ for digital logic enthusiasts
</div>
