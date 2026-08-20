const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredFiles = [
  'HANDOFF.md',
  'TODO.md',
  'docs/handoffs/EPIC-01/FEAT-01.01-scaffold-monorepo.md',
  'docs/handoffs/EPIC-01/FEAT-01.02-web-app-scaffold.md',
  'docs/handoffs/EPIC-01/FEAT-01.03-api-app-scaffold.md',
  'docs/handoffs/EPIC-01/FEAT-01.04-bootstrap-validation-and-script-repair.md',
  'docs/handoffs/EPIC-01/FEAT-01.05-agent-rules-folder.md',
  'docs/features/FEAT-01.01-scaffold-monorepo.md',
  'docs/features/FEAT-01.02-web-app-scaffold.md',
  'docs/features/FEAT-01.03-api-app-scaffold.md',
  'docs/features/FEAT-01.04-bootstrap-validation-and-script-repair.md',
  'docs/features/FEAT-01.05-agent-rules-folder.md',
  'docs/features/FEAT-02.01-improve-ci-validation-workflow.md',
  'docs/features/FEAT-02.02-local-environment-bootstrap-helpers.md',
  'docs/features/FEAT-02.03-prepare-deployment-configuration.md',
  'docs/features/FEAT-03.01-create-shared-ui-primitives.md',
  'docs/features/FEAT-03.02-i18n-structure-and-locale-routing.md',
  'docs/features/FEAT-03.03-design-tokens-and-styling-foundation.md',
  'docs/features/FEAT-04.01-auth-domain-models-and-dtos.md',
  'docs/features/FEAT-04.02-registration-and-login-endpoints.md',
  'docs/features/FEAT-04.03-session-management-and-profile-basics.md',
  'docs/features/FEAT-05.01-content-domain-models-and-admin-endpoints.md',
  'docs/handoffs/EPIC-02/FEAT-02.01-improve-ci-validation-workflow.md',
  'docs/handoffs/EPIC-02/FEAT-02.02-local-environment-bootstrap-helpers.md',
  'docs/handoffs/EPIC-02/FEAT-02.03-prepare-deployment-configuration.md',
  'docs/handoffs/EPIC-03/FEAT-03.01-create-shared-ui-primitives.md',
  'docs/handoffs/EPIC-03/FEAT-03.02-i18n-structure-and-locale-routing.md',
  'docs/handoffs/EPIC-03/FEAT-03.03-design-tokens-and-styling-foundation.md',
  'docs/handoffs/EPIC-04/FEAT-04.01-auth-domain-models-and-dtos.md',
  'docs/handoffs/EPIC-04/FEAT-04.02-registration-and-login-endpoints.md',
  'docs/handoffs/EPIC-04/FEAT-04.03-session-management-and-profile-basics.md',
  'docs/handoffs/EPIC-05/FEAT-05.01-content-domain-models-and-admin-endpoints.md',
  'docs/handoffs/EPIC-06/FEAT-06.01-learning-path-and-dashboard.md',
  'docs/handoffs/EPIC-07/FEAT-07.01-hiragana-foundation.md',
  'docs/features/FEAT-07.01-hiragana-foundation.md',
  'docs/handoffs/EPIC-08/FEAT-08.01-katakana-foundation.md',
  'docs/features/FEAT-08.01-katakana-foundation.md',
  'docs/handoffs/EPIC-09/FEAT-09.01-vocabulary-foundation.md',
  'docs/features/FEAT-09.01-vocabulary-foundation.md',
  'docs/handoffs/EPIC-10/FEAT-10.01-grammar-foundation.md',
  'docs/features/FEAT-10.01-grammar-foundation.md',
  'docs/handoffs/EPIC-11/FEAT-11.01-kanji-foundation.md',
  'docs/features/FEAT-11.01-kanji-foundation.md',
  '.agents/AGENTS.md',
  '.agents/README.md',
  'docker-compose.yml',
  '.env.example',
  'docs/LOCAL_DEVELOPMENT.md',
  'docs/DEPLOYMENT.md',
  'docs/DESIGN_SYSTEM.md',
  'docs/DATA_MODEL.md',
  'apps/api/prisma/migrations/20260807000000_auth_foundation/migration.sql',
  'apps/api/prisma/migrations/20260813000000_content_foundation/migration.sql',
  'apps/api/prisma/migrations/20260818141015_progress_foundation/migration.sql',
  'apps/api/prisma/migrations/20260820120000_flashcards_srs/migration.sql'
];

const requiredRootMarkers = [
  'Latest completed feature: FEAT-12.01',
  '- Open blockers: Docker Desktop must be started to run database seed.'
];

const requiredTodoMarkers = [
  '- [x] Add root `format:check`, `test:e2e`, and `handoff:validate` scripts.',
  '- [x] Remove lint failure masking from the API package.',
  '- [x] Replace deprecated web lint command with ESLint.',
  '- [x] Create `.agents/` with mirrored agent rules.',
  '- [x] Improve GitHub Actions CI validation workflow.',
  '- [x] Add local environment bootstrap helpers.',
  '- [x] Prepare deployment configuration.',
  '- [x] Create shared UI primitives.',
  '- [x] Add i18n structure and locale routing.',
  '- [x] Add design tokens and styling foundation.',
  '- [x] Add auth domain models and DTOs.',
  '- [x] Add register endpoint.',
  '- [x] Add login endpoint.',
  '- [x] Add web auth flows and session handling.',
  '- [x] Add refresh token rotation and revoke flow.',
  '- [x] Add basic profile endpoint.',
  '- [x] Add content domain models and Prisma migrations.',
  '- [x] Add initial content admin endpoints.',
  '- [x] Add publish/archive validation.',
  '- [x] Apply content foundation migration locally.'
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const errors = missing.map((file) => `Missing required handoff artifact: ${file}`);

if (missing.length === 0) {
  const handoff = fs.readFileSync(path.join(root, 'HANDOFF.md'), 'utf8');
  const todo = fs.readFileSync(path.join(root, 'TODO.md'), 'utf8');

  for (const marker of requiredRootMarkers) {
    if (!handoff.includes(marker)) {
      errors.push(`HANDOFF.md is missing marker: ${marker}`);
    }
  }

  for (const marker of requiredTodoMarkers) {
    if (!todo.includes(marker)) {
      errors.push(`TODO.md is missing marker: ${marker}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Handoff validation passed.');
