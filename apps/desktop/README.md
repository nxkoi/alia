# Desktop App (Electron)

This directory will contain the Electron desktop application.

## To be implemented:

1. Electron main process configuration
2. Window management
3. Desktop-specific features (system tray, notifications)
4. Shared UI components from `@aide/shared`
5. Integration with `@aide/ai` for human-in-the-loop workflows

## Expected structure:

```
apps/desktop/
├── package.json
├── tsconfig.json
├── electron.config.js
├── src/
│   ├── main/          # Electron main process
│   ├── renderer/      # React renderer process
│   └── preload/       # Preload scripts
└── resources/         # App icons and resources
```

## Requirements:

- Use `@aide/shared` types
- Implement invisible interface pattern
- Support human-in-the-loop AI workflows
- Follow safety guidelines for destructive actions
