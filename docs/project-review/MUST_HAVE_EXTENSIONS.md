# Must Have VSCode Extensions for Val Store

## 🔧 Core Development

### TypeScript & JavaScript

| Extension           | ID                       | Purpose                       |
| ------------------- | ------------------------ | ----------------------------- |
| **ESLint**          | `dbaeumer.vscode-eslint` | JavaScript/TypeScript linting |
| **Prettier**        | `esbenp.prettier-vscode` | Code formatting               |
| **TypeScript Hero** | `rbbit.typescript-hero`  | TypeScript import management  |

### React & Next.js

| Extension                     | ID                                   | Purpose                   |
| ----------------------------- | ------------------------------------ | ------------------------- |
| **ES7+ React/Redux Snippets** | `dsznajder.es7-react-js-snippets`    | React code snippets       |
| **Simple React Snippets**     | `burkeholland.simple-react-snippets` | Additional React snippets |
| **Next.js snippets**          | `pulkitgangwar.nextjs-snippets`      | Next.js specific snippets |

### Tailwind CSS

| Extension                     | ID                          | Purpose                         |
| ----------------------------- | --------------------------- | ------------------------------- |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwind autocomplete & preview |
| **Tailwind Docs**             | `austenc.tailwind-docs`     | Quick Tailwind docs access      |
| **Headwind**                  | `heybourn.headwind`         | Tailwind class sorting          |

---

## 🗄️ Database & Backend

### Database Tools

| Extension           | ID                                | Purpose                           |
| ------------------- | --------------------------------- | --------------------------------- |
| **Prisma**          | `prisma.prisma`                   | Prisma schema syntax highlighting |
| **PostgreSQL**      | `ckolkman.vscode-postgres`        | PostgreSQL database explorer      |
| **Database Client** | `cweijan.vscode-database-client2` | Multiple DB support               |

### API Development

| Extension          | ID                             | Purpose              |
| ------------------ | ------------------------------ | -------------------- |
| **Thunder Client** | `rangav.vscode-thunder-client` | REST API client      |
| **REST Client**    | `humao.rest-client`            | HTTP request testing |

---

## 🎨 UI/UX Development

### Styling

| Extension           | ID                                    | Purpose                  |
| ------------------- | ------------------------------------- | ------------------------ |
| **Color Highlight** | `naumovs.color-highlight`             | CSS color preview        |
| **CSS Peek**        | `pranaygp.vscode-css-peek`            | Peek CSS definitions     |
| **Image preview**   | `kisstkondoros.vscode-gutter-preview` | Image previews in gutter |

### Icons

| Extension               | ID                               | Purpose               |
| ----------------------- | -------------------------------- | --------------------- |
| **Material Icon Theme** | `pkief.material-icon-theme`      | File/folder icons     |
| **vscode-icons**        | `vscode-icons-team.vscode-icons` | Alternative icon pack |

---

## 🔒 Git & Version Control

| Extension                | ID                                   | Purpose               |
| ------------------------ | ------------------------------------ | --------------------- |
| **GitLens**              | `eamodio.gitlens`                    | Git supercharged      |
| **Git Graph**            | `mhutchie.git-graph`                 | Visual git history    |
| **Conventional Commits** | `vivaxy.vscode-conventional-commits` | Commit message helper |

---

## 🧪 Testing

| Extension           | ID                             | Purpose                |
| ------------------- | ------------------------------ | ---------------------- |
| **Vitest**          | `vitest.explorer`              | Vitest test explorer   |
| **Playwright Test** | `ms-playwright.playwright`     | Playwright E2E testing |
| **Jest Runner**     | `firsttris.vscode-jest-runner` | Run Jest tests inline  |

---

## 📊 Productivity

### Code Quality

| Extension           | ID                            | Purpose              |
| ------------------- | ----------------------------- | -------------------- |
| **Error Lens**      | `usernamehw.errorlens`        | Inline error display |
| **TODO Highlight**  | `wayou.vscode-todo-highlight` | Highlight TODOs      |
| **Better Comments** | `aaron-bond.better-comments`  | Colorful comments    |
| **Import Cost**     | `wix.vscode-import-cost`      | Show import sizes    |

### Navigation

| Extension                    | ID                                   | Purpose                 |
| ---------------------------- | ------------------------------------ | ----------------------- |
| **Path Intellisense**        | `christian-kohler.path-intellisense` | File path autocomplete  |
| **Auto Rename Tag**          | `formulahendry.auto-rename-tag`      | Rename paired HTML tags |
| **Bracket Pair Colorizer 2** | Built-in                             | Colored bracket pairs   |

### Snippets & Autocomplete

| Extension          | ID                       | Purpose                       |
| ------------------ | ------------------------ | ----------------------------- |
| **GitHub Copilot** | `github.copilot`         | AI code suggestions           |
| **Tabnine**        | `tabnine.tabnine-vscode` | AI autocomplete (alternative) |

---

## 🔐 Security & Environment

| Extension  | ID                    | Purpose                       |
| ---------- | --------------------- | ----------------------------- |
| **DotENV** | `mikestead.dotenv`    | .env file syntax highlighting |
| **ENV**    | `irongeek.vscode-env` | Env file support              |

---

## 📝 Documentation

| Extension                     | ID                                    | Purpose             |
| ----------------------------- | ------------------------------------- | ------------------- |
| **Markdown All in One**       | `yzhang.markdown-all-in-one`          | Markdown editing    |
| **Markdown Preview Enhanced** | `shd101wyy.markdown-preview-enhanced` | Enhanced MD preview |
| **markdownlint**              | `davidanson.vscode-markdownlint`      | Markdown linting    |

---

## ⚙️ Recommended VSCode Settings

Add to your `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

## 🚀 Quick Install Commands

### Install all essential extensions via command line:

```bash
# Core Development
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension heybourn.headwind

# Database
code --install-extension prisma.prisma
code --install-extension ckolkman.vscode-postgres

# Git
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph

# Productivity
code --install-extension usernamehw.errorlens
code --install-extension wayou.vscode-todo-highlight
code --install-extension christian-kohler.path-intellisense
code --install-extension mikestead.dotenv

# Documentation
code --install-extension yzhang.markdown-all-in-one

# Testing
code --install-extension vitest.explorer
code --install-extension ms-playwright.playwright
```

### Or create an extensions list file:

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    "bradlc.vscode-tailwindcss",
    "heybourn.headwind",
    "prisma.prisma",
    "eamodio.gitlens",
    "mhutchie.git-graph",
    "usernamehw.errorlens",
    "wayou.vscode-todo-highlight",
    "christian-kohler.path-intellisense",
    "mikestead.dotenv",
    "yzhang.markdown-all-in-one",
    "vitest.explorer",
    "ms-playwright.playwright"
  ]
}
```

---

## 📌 Priority Ranking

### 🔴 Essential (Must Install)

1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense
4. ES7+ React Snippets
5. GitLens
6. DotENV

### 🟠 Highly Recommended

7. Error Lens
8. Prisma
9. Path Intellisense
10. TODO Highlight

### 🟡 Nice to Have

11. Git Graph
12. Thunder Client
13. Vitest Explorer
14. Better Comments
