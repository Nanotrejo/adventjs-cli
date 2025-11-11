# Copilot Instructions for AdventJS-CLI

## Architecture and Key Components
- The project is organized in `/src` with subfolders for services (`services/`), schemas (`schema/`), API (`api/`), types (`types/`), and templates (`templates/`).
- Services implement reusable logic for initialization, day generation, file handling, markdown, scraping, and configuration.
- Schemas in `schema/` define the data structure for responses, commands, configuration, and dependencies.
- Challenges and solutions are managed per year in folders like `adventjs-2024/`.

## Development Workflow
- **Compilation:** Uses TypeScript. Run `npm i` and then `npx tsc x.ts && node x.js` to compile and run individual files.
- **Global build:** Use the `tsc: build index.ts` task to compile the main project.
- **Tests:** Run `npx jest` to execute tests. Configuration in `jest.config.js`.
- **Style:** Run `npx prettier . --write` to format the code.
- **File copies:** Use the `scripts/copy-files.js` script to copy necessary files after build.

## Conventions and Patterns
- Services follow the `*.service.ts` pattern and are instantiated directly from other modules.
- Schemas use `zod` for data validation.
- Challenge HTML files are in `src/html/` and named by year and challenge number.
- ESLint and TypeScript configurations are in the root and in `templates/` for automatic generation.
- CLI commands and flows are defined in `src/index.ts` and use services to orchestrate tasks.

## Integrations and Dependencies
- Uses `puppeteer` for web scraping.
- Uses `chalk` for colored console output.
- Dependencies are installed automatically when initializing the project.

## Example Usage of Services
```ts
import { generateDay } from './services/generate-day.service'
generateDay(5)
```

## Key Files
- `src/index.ts`: Main CLI entry point.
- `src/services/`: Business logic and utilities.
- `src/schema/`: Data validation and definition.
- `scripts/copy-files.js`: Post-build utility script.
- `adventjs-2024/`: Challenges and solutions by year.

## Best Practices
- Keep business logic in services and orchestration in the CLI.
- Use schemas to validate all relevant input/output.
- Update templates in `src/templates/` for new years or format changes.

---

## Tests and Coverage
- Test files should be located next to the code they test, using the `.spec.ts` suffix.
- To add new tests, follow the structure of existing ones and use Jest for assertions.
- Run `npx jest` to execute all tests and check coverage.

## Dependency Updates
- To update dependencies, use `npm update` and review changes in `package.json` and `package-lock.json`.
- Check compatibility of new versions and run tests before merging.

## Automation and Scripts
- Scripts in `scripts/` can be extended for new automation tasks.
- Document any new script in the main README.

## Version Management
- Use git tags to mark important releases: `git tag v1.0.0 && git push --tags`.
- Keep a changelog in the README or a dedicated file to record relevant changes.