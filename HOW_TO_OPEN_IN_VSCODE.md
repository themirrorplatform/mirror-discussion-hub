# How to Open The Mirror Discussion Hub in VS Code

## Quick Start

### Method 1: Command Line (Recommended)

```bash
# Navigate to the project directory
cd /home/user/mirror-discussion-hub

# Open in VS Code
code .
```

### Method 2: VS Code GUI

1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to `/home/user/mirror-discussion-hub`
4. Click **Open**

### Method 3: Drag and Drop

1. Open VS Code
2. Drag the `mirror-discussion-hub` folder from your file manager
3. Drop it onto the VS Code window

---

## First Time Setup

### 1. Install Recommended Extensions

When you first open the project, VS Code will prompt:
> "This workspace has extension recommendations. Would you like to install them?"

Click **Install All** to get these essential extensions:

**Core Extensions:**
- ESLint - Code linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind autocomplete
- ES7+ React/Redux/React-Native snippets - React snippets

**Recommended Extensions:**
- GitLens - Advanced Git features
- Path Intellisense - Auto-complete file paths
- Error Lens - Inline error messages
- Supabase - Database tools
- Todo Tree - Track TODOs in code

**Manual Installation (if needed):**
1. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
2. Search for extension name
3. Click **Install**

### 2. Install Dependencies

Open the integrated terminal:
- Press `` Ctrl+` `` (backtick) or **View** → **Terminal**

Run:
```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit with your Supabase credentials
code .env
```

Add your Supabase URL and anon key.

### 4. Trust the Workspace

VS Code may ask: "Do you trust the authors of the files in this folder?"
- Click **Yes, I trust the authors**

---

## VS Code Configuration Included

The project includes pre-configured VS Code settings:

### `.vscode/settings.json`
- ✅ Format on save enabled
- ✅ Auto-import organization
- ✅ Tailwind CSS IntelliSense configured
- ✅ TypeScript strict mode
- ✅ Prettier as default formatter

### `.vscode/extensions.json`
- Lists all recommended extensions
- Auto-prompts for installation

### `.vscode/launch.json`
- Debug configurations for Chrome and Node
- Press `F5` to start debugging

### `.vscode/tasks.json`
- Pre-configured tasks:
  - `Ctrl+Shift+B` - Run dev server
  - Build task available
  - Install task available

### `.vscode/snippets.code-snippets`
- Custom code snippets:
  - `rfc` - React functional component
  - `mirrorcard` - Mirror-themed card
  - `mirrorbtn` - Mirror-themed button
  - `impsanitize` - Import sanitize
  - `impapi` - Import API functions

---

## Useful VS Code Shortcuts

### General
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette
- `Ctrl+B` - Toggle sidebar
- `` Ctrl+` `` - Toggle terminal
- `Ctrl+Shift+E` - Explorer
- `Ctrl+Shift+F` - Search across files

### Editing
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+Up/Down` - Copy line up/down
- `Ctrl+D` - Select next occurrence
- `Ctrl+Shift+L` - Select all occurrences
- `Ctrl+/` - Toggle comment
- `Alt+Shift+F` - Format document

### Navigation
- `Ctrl+G` - Go to line
- `F12` - Go to definition
- `Ctrl+Click` - Go to definition
- `Alt+Left/Right` - Navigate back/forward
- `Ctrl+Shift+O` - Go to symbol

### Development
- `F5` - Start debugging
- `Ctrl+Shift+B` - Run build task
- `Ctrl+Shift+M` - View problems
- `Ctrl+Shift+U` - View output

---

## Running the Project

### Start Development Server

**Option 1: Terminal**
```bash
npm run dev
```

**Option 2: Tasks**
1. Press `Ctrl+Shift+B`
2. Select "npm: dev"

**Option 3: Command Palette**
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "npm: dev"

The app will open at http://localhost:3000

### Build for Production

```bash
npm run build
```

Or use the build task: `Ctrl+Shift+P` → "Tasks: Run Task" → "npm: build"

---

## Debugging in VS Code

### Debug in Chrome

1. Start the dev server: `npm run dev`
2. Press `F5`
3. Select "Launch Chrome against localhost"
4. Chrome will open with debugger attached
5. Set breakpoints by clicking line numbers

### Debug Server-Side

1. Press `F5`
2. Select "Launch Vite Dev Server"
3. Terminal will show server output
4. Set breakpoints in your code

---

## Git Integration

VS Code has built-in Git support:

### Source Control Panel
- Click the Git icon in the sidebar (or `Ctrl+Shift+G`)
- View changes, stage files, commit, push/pull

### GitLens (if installed)
- Inline blame annotations
- File history
- Compare branches
- Rich commit history

### Useful Git Commands in VS Code
- `Ctrl+Shift+P` → "Git: Commit"
- `Ctrl+Shift+P` → "Git: Push"
- `Ctrl+Shift+P` → "Git: Pull"
- `Ctrl+Shift+P` → "Git: Create Branch"

---

## Workspace Features

### Multi-root Workspace (Optional)

If you're working on multiple related projects:

1. **File** → **Add Folder to Workspace**
2. Add related projects
3. **File** → **Save Workspace As**
4. Save as `mirror-workspace.code-workspace`

### Workspace Settings

Settings are stored in `.vscode/settings.json` and apply to this project only.

To edit:
1. `Ctrl+,` - Open settings
2. Click "Workspace" tab
3. Modify as needed

---

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prettier not formatting
1. Check `.prettierrc` exists
2. Verify Prettier extension is installed
3. Settings → "Format On Save" is enabled
4. Right-click file → "Format Document With..." → Choose Prettier

### Tailwind CSS IntelliSense not working
1. Install "Tailwind CSS IntelliSense" extension
2. Check `tailwind.config.js` exists
3. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"

### TypeScript errors everywhere
```bash
# Restart TypeScript server
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Git not showing up
1. Ensure folder is a Git repository
2. Check `.git` folder exists
3. Reload VS Code

---

## Recommended Workflow

### Daily Development

1. **Open project**: `code .`
2. **Pull latest changes**: `Ctrl+Shift+P` → "Git: Pull"
3. **Install dependencies** (if needed): `npm install`
4. **Start dev server**: `Ctrl+Shift+B`
5. **Make changes** in the editor
6. **Save** (auto-formats with Prettier)
7. **Test** in browser at localhost:3000
8. **Commit**: Use Source Control panel
9. **Push**: `Ctrl+Shift+P` → "Git: Push"

### Best Practices

- ✅ Let Prettier format on save (already configured)
- ✅ Use TypeScript strict mode (already enabled)
- ✅ Use provided code snippets (`rfc`, `mirrorcard`, etc.)
- ✅ Check Problems panel for errors (`Ctrl+Shift+M`)
- ✅ Use ESLint warnings to improve code quality
- ✅ Commit frequently with clear messages

---

## Additional Resources

### VS Code Documentation
- [VS Code Docs](https://code.visualstudio.com/docs)
- [React in VS Code](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)
- [TypeScript in VS Code](https://code.visualstudio.com/docs/languages/typescript)

### Project Documentation
- `SETUP.md` - Complete setup guide
- `FIXES_COMPLETED.md` - What's been fixed
- `QA_REPORT.md` - Full QA analysis
- `supabase/README.md` - Database setup

---

## Need Help?

If you encounter issues:

1. Check the Problems panel (`Ctrl+Shift+M`)
2. Check the Output panel (`Ctrl+Shift+U`)
3. Check the Terminal for build errors
4. Restart TypeScript server
5. Reload VS Code window
6. Check project documentation

**Happy Coding! 🪞**
