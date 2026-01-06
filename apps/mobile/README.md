# Mobile App (React Native)

This directory will contain the React Native mobile application.

## To be implemented:

1. React Native configuration (iOS + Android)
2. Mobile-specific navigation
3. Mobile UI components following invisible interface pattern
4. Push notifications
5. Offline support
6. Shared types from `@aide/shared`
7. Integration with `@aide/ai` for human-in-the-loop workflows

## Expected structure:

```
apps/mobile/
├── package.json
├── tsconfig.json
├── metro.config.js
├── src/
│   ├── screens/       # Mobile screens
│   ├── components/    # Mobile components
│   ├── navigation/    # Navigation setup
│   └── lib/          # Utilities and clients
├── ios/              # iOS specific files
└── android/          # Android specific files
```

## Requirements:

- Use `@aide/shared` types
- Implement mobile-friendly invisible interface pattern
- Support human-in-the-loop AI workflows
- Follow safety guidelines for destructive actions
- Optimize for mobile performance
