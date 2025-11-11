# 🎄 AdventJS-CLI

AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡

- 📝 Generates TypeScript starter files + tests
- 📖 Adds challenge description in Markdown format
- ⚙️ Handles project init, dependencies, and config automatically
- 📅 Ready for 2024, 2025, and beyond

Focus on solving the challenges, not setting them up! 🚀

## How to use it

### 1️⃣ Initialize your project

Start by initializing your AdventJS project:

```bash
npx adventjs-cli init
```

This command will guide you through a step-by-step setup.

The tool will create a new folder (`adventjs-YYYY`) with all necessary configuration files and a ready-to-use project structure.

### 2️⃣ Generate boilerplate for a specific day

Once your project is initialized, generate the starter files for any challenge day:

```bash
npx adventjs-cli g <day>
```

Replace `<day>` with the challenge day number (e.g., `1`, `5`, `25`).

**Example:**

```bash
npx adventjs-cli g 1
```

### 🔧 DEV MODE

### Run

```bash
npm run start
```

### Publish package

```bash
npm publish
```

#### Debug package content

```bash
npm pack --dry-run
```

### Debug package

#### Generate package from root

```bash
npm run build && chmod +x dist/index.js
```

#### Install while being on the generated folder

```bash
npm install ../ && npx adventjs-cli init
```
