# 🎄 AdventJS-CLI

AdventJS CLI Generator – Spin up your [AdventJS challenges](https://adventjs.dev/) in seconds! 🎄⚡. Available in [npm](https://www.npmjs.com/package/adventjs-cli).

- 📝 Instantly generates the boilerplate for each daily AdventJS challenge
  - 🗂️ TypeScript function template (ready for your solution)
  - 📄 Problem description in markdown
  - 🧪 Associated test file to validate your code
- ⚙️ Out-of-the-box support for
  - 🐞 Debugging
  - 🧪 Testing with Jest
  - 🛠️ TypeScript config
  - 🧹 Linting (ESLint)
  - 🎨 Formatting (Prettier)
  - 🤖 GitHub Actions for CI
  - 🖥️ VSCode integration
- 📅 Ready for 2024 challenges

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

### Publish package using pipelines

1. Change `package.json` and `APP_VERSION` version number.
2. Push changes
3. Create tag with version v.x.x
4. Push tags

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
