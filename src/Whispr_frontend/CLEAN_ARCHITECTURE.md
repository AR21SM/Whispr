# Clean Frontend Architecture

## Folder Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Card, Alert, etc.)
│   ├── forms/           # Form-related components (Input, TextArea, Select)
│   ├── layout/          # Layout components (Header, Footer, Navbar)
│   ├── auth/            # Authentication components
│   └── common/          # Common components (StatusComponents, SortableHeader)
├── features/            # Feature-specific components
│   ├── reports/         # Report-related features (ReportCard, ReportTable)
│   ├── authority/       # Authority features (AuthorityStats)
│   ├── dashboard/       # Dashboard features
│   ├── home/           # Home page features
│   └── chat/           # Chat features
├── pages/              # Page components (clean versions)
├── hooks/              # Custom hooks (useReports, useFilters, useAuthorityStats)
├── services/           # API services (reportService, authorityService)
├── utils/              # Utility functions (helpers, storage)
├── constants/          # Constants and configuration
└── assets/             # Static assets
```

## Key Features

### 1. Custom Hooks
- `useReports`: Manages report data fetching and state
- `useFilters`: Handles filtering, sorting, and searching
- `useAuthorityStats`: Manages authority statistics

### 2. Services Layer
- `reportService`: All report-related API calls
- `authorityService`: Authority-specific operations

### 3. Utility Functions
- Date formatting, text truncation, file conversion
- Local storage management with error handling
- Common helper functions

### 4. Reusable Components
- Clean UI components with consistent styling
- Form components with built-in validation styling
- Status components with standardized icons and colors

### 5. Clean Pages
- `AuthorityPageClean`: Refactored authority dashboard
- `DashboardPageClean`: Clean user dashboard
- Both use the new hooks and services

## Benefits
- Better code organization and maintainability
- Reusable components reduce duplication
- Custom hooks manage complex state logic
- Services layer abstracts API calls
- Consistent styling and behavior
- Easier testing and debugging

## Usage
To use the clean version, import `AppClean` instead of `App` in your main.jsx file.
