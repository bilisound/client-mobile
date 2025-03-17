# Bilisound Client Mobile Project Architecture

## 1. Project Overview
Bilisound is a mobile application project with a monorepo structure, utilizing modern web technologies and a modular architecture.

## 2. Project Structure
```
bilisound/client-mobile/
├── apps/
│   ├── mobile/           # Main mobile application
│   └── server-cf/        # Cloudflare server-side components
├── packages/
│   └── sdk/              # Shared SDK and utilities
├── package.json          # Project-level dependency management
├── pnpm-workspace.yaml   # Workspace configuration
└── turbo.json            # Turborepo configuration
```

## 3. Technology Stack
- Package Manager: pnpm
- Build System: Turborepo
- Mobile Framework: React Native (based on the `.tsx` file extension)
- Development Tools:
  - Prettier for code formatting
  - TypeScript for type safety

## 4. Key Directories and Their Purposes

### Apps Directory
- `mobile/`: Primary mobile application
  - Contains the main application code
  - Includes components, screens, and app-specific logic

### Packages Directory
- `sdk/`: Shared SDK
  - Contains reusable utilities, types, and shared logic across the project

## 5. Dependency Management
- Uses `pnpm` for package management
- Workspace configuration in [pnpm-workspace.yaml](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/pnpm-workspace.yaml:0:0-0:0)
- Dependency versions managed in [package.json](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/package.json:0:0-0:0)

## 6. Code File Dependencies

### Mobile App Key Files

## 7. Code File Dependencies and Module Relationships

### Key Modules and Components

#### Main Application Structure
- [app/_layout.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/_layout.tsx:0:0-0:0): Root layout configuration
- `app/(main)/_layout.tsx`: Main application layout
- `app/(main)/index.tsx`: Main landing page/home screen

#### Feature Modules
1. **Playlist Management**
   - `app/(main)/(playlist)/playlist.tsx`
   - `app/(main)/(playlist)/detail/[id].tsx`
   - `app/(main)/(playlist)/meta/[id].tsx`

2. **Player Controls**
   - `components/main-bottom-sheet/` directory contains player-related components:
     - [player-control.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/components/main-bottom-sheet/components/player-control.tsx:0:0-0:0)
     - [player-progress-bar.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/components/main-bottom-sheet/components/player-progress-bar.tsx:0:0-0:0)
     - [player-queue-list.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/components/main-bottom-sheet/components/player-queue-list.tsx:0:0-0:0)
     - [speed-control-panel.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/components/main-bottom-sheet/components/speed-control-panel.tsx:0:0-0:0)

3. **Settings**
   - `app/settings/` directory with multiple configuration screens:
     - [about.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/settings/about.tsx:0:0-0:0)
     - [data.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/settings/data.tsx:0:0-0:0)
     - [theme.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/settings/theme.tsx:0:0-0:0)
     - [license.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/settings/license.tsx:0:0-0:0)

4. **Utility Components**
   - `components/` directory with various utility and UI components
   - [app/utils/cover-picker.tsx](cci:7://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/utils/cover-picker.tsx:0:0-0:0)

## 8. Dependency Flow

```mermaid
graph TD
    A[Root Layout: _layout.tsx] --> B[Main Layout: (main)/_layout.tsx]
    B --> C[Home Screen: index.tsx]
    B --> D[Playlist Module]
    B --> E[Player Controls]
    B --> F[Settings Module]
    
    D --> D1[Playlist List]
    D --> D2[Playlist Detail]
    
    E --> E1[Player Control Buttons]
    E --> E2[Progress Bar]
    E --> E3[Queue Management]
    
    F --> F1[Theme Settings]
    F --> F2[Data Management]
    F --> F3[About Page]
```

## 9. Key Implementation Details

### Download Functionality

## 10. Download Management
The download management module provides a comprehensive view of ongoing downloads:

- Uses `useDownloadStore` for state management
- Implements a [DownloadEntry](cci:1://file:///Users/tcdw/Projects/bilisound/client-mobile/apps/mobile/app/download.tsx:13:0-54:1) component to render individual download items
- Features:
  - Download status tracking (queued, in progress)
  - Download speed calculation
  - Progress bar visualization
  - Sorting downloads by start time

## 11. State Management
The project appears to use a custom store implementation, likely based on Zustand, for managing application state:
- `~/store/download.ts`: Manages download-related state
- Centralized state management for downloads, player controls, and other app features

## 12. UI/UX Considerations
- Uses Tailwind CSS for styling (evident from `className` attributes)
- Responsive layout with flex and grid-based designs
- Custom components like `Layout`, `Text`, and `Pressable`
- Performance optimization with `FlashList` for rendering long lists

## 13. Development Recommendations
1. Modularize state management
2. Continue using TypeScript for type safety
3. Maintain component-based architecture
4. Consider adding more comprehensive error handling
5. Implement comprehensive logging and monitoring

## 14. Performance Insights
- Uses `FlashList` for efficient list rendering
- Implements lazy loading and virtualization
- Calculates download speeds with minimal overhead

## Conclusion
Bilisound is a well-structured mobile application with a modular architecture, focusing on clean code organization, performance, and user experience. The use of modern web technologies and a monorepo structure allows for efficient development and maintenance.
