# 📁 Project Structure - secure-code-reviewer

**Last Updated**: 2024-12-19 22:00 UTC

---

## 🏗️ **Root Directory Structure**

```
code-reviewer/
├── 📁 backend/                 # Node.js + TypeScript backend
├── 📁 frontend/                # React + TypeScript frontend  
├── 📁 project-tracker/         # Documentation and tracking
├── 📄 README.md               # Main project documentation
├── 📄 .gitignore              # Git ignore rules
└── 📄 package.json            # Root package configuration (if any)
```

---

## 🔧 **Backend Structure (`/backend/`)**

```
backend/
├── 📁 src/                    # Source code
│   ├── 📁 services/           # Business logic services
│   │   ├── 📁 checks/         # Vulnerability check implementations
│   │   │   └── 📄 sqlInjection.ts    # SQL injection detection logic
│   │   └── 📄 codeAnalysis.ts # Main analysis orchestrator
│   ├── 📁 routes/             # API route handlers
│   │   └── 📄 codeReview.ts   # Code review API endpoints
│   ├── 📁 types/              # TypeScript type definitions
│   │   └── 📄 vulnerability.ts # Vulnerability interfaces
│   └── 📄 index.ts            # Main server entry point
├── 📁 tests/                  # Test files
│   └── 📁 unit/               # Unit tests
│       └── 📄 sqlInjectionApi.test.ts # API integration tests
├── 📁 dist/                   # Compiled JavaScript (build output)
├── 📄 package.json            # Dependencies and scripts
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 jest.config.js          # Jest testing configuration
```

### **Key Backend Files**

#### **Core Application**
- **`src/index.ts`**: Express server setup, middleware, port 3001
- **`src/services/codeAnalysis.ts`**: Main analysis service orchestrator
- **`src/routes/codeReview.ts`**: API endpoints for code analysis

#### **SQL Injection Detection**
- **`src/services/checks/sqlInjection.ts`**: Core vulnerability detection logic
- **`src/types/vulnerability.ts`**: TypeScript interfaces for vulnerabilities

#### **Testing**
- **`tests/unit/sqlInjectionApi.test.ts`**: Comprehensive API tests (39 test cases)
- **`jest.config.js`**: Jest configuration for testing

#### **Configuration**
- **`package.json`**: Dependencies, scripts with 2048MB memory allocation
- **`tsconfig.json`**: TypeScript strict mode configuration

---

## ⚛️ **Frontend Structure (`/frontend/`)**

```
frontend/
├── 📁 src/                    # Source code
│   ├── 📁 components/         # React components
│   │   ├── 📄 Analyzer.tsx    # Main analyzer page (NEW: side-by-side layout)
│   │   ├── 📄 ResultsPage.tsx # Results display page
│   │   ├── 📄 AnalysisResults.tsx # Vulnerability results component
│   │   ├── 📄 Header.tsx      # Navigation header
│   │   ├── 📄 Home.tsx        # Landing page
│   │   ├── 📄 Features.tsx    # Features showcase
│   │   ├── 📄 About.tsx       # About page
│   │   └── 📄 types.ts        # Component type definitions
│   ├── 📁 styles/             # CSS Modules (NEW)
│   │   └── 📄 Analyzer.module.css # Professional analyzer styling
│   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 __tests__/      # Utility tests
│   │   │   └── 📄 languageDetector.test.ts # Language detection tests
│   │   └── 📄 languageDetector.ts # Language detection logic
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📄 App.tsx             # Main application component
│   ├── 📄 main.tsx            # React application entry point
│   └── 📄 index.css           # Global styles
├── 📁 public/                 # Static assets
├── 📁 dist/                   # Build output (production)
├── 📄 package.json            # Dependencies and scripts
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 vite.config.ts          # Vite build configuration
└── 📄 index.html              # HTML template
```

### **Key Frontend Files**

#### **Core Components**
- **`src/App.tsx`**: Main application with routing and state management
- **`src/components/Header.tsx`**: Navigation header with section switching

#### **Analyzer Page (MAJOR UPDATE)**
- **`src/components/Analyzer.tsx`**: Complete redesign with side-by-side layout
- **`src/styles/Analyzer.module.css`**: Professional CSS modules styling
  - Responsive design (desktop: side-by-side, mobile: stacked)
  - Code editor 1.2x wider than drag & drop section
  - Custom scrollbars and hover animations

#### **Results & Analysis**
- **`src/components/ResultsPage.tsx`**: Professional results display
- **`src/components/AnalysisResults.tsx`**: Vulnerability details rendering

#### **Utilities**
- **`src/utils/languageDetector.ts`**: Pattern-based language detection
- **`src/utils/__tests__/languageDetector.test.ts`**: Comprehensive tests

#### **Styling Architecture**
- **`src/styles/Analyzer.module.css`**: Scoped CSS modules
- **`src/index.css`**: Global styles and animations

#### **Configuration**
- **`vite.config.ts`**: Vite configuration (port 8001)
- **`package.json`**: Dependencies and build scripts

---

## 📚 **Documentation Structure (`/project-tracker/`)**

```
project-tracker/
├── 📄 CONTEXT_2024-12-19.md     # Overall project context and progress
├── 📄 BACKEND_TRACKER.md        # Backend development tracking
├── 📄 PROJECT_STRUCTURE.md      # This file - project organization
└── 📄 sanity-check.md           # Pre-deployment checklist
```

### **Documentation Files**
- **`CONTEXT_2024-12-19.md`**: High-level project status and architecture
- **`BACKEND_TRACKER.md`**: Detailed backend development progress
- **`PROJECT_STRUCTURE.md`**: File organization and architecture
- **`sanity-check.md`**: Comprehensive pre-deployment checklist

---

## 🎨 **New Styling Architecture**

### **CSS Modules Implementation**
```
frontend/src/styles/
└── 📄 Analyzer.module.css      # Scoped component styles
```

#### **Key CSS Classes**
```css
.analyzerContainer          # Main container with gradient background
.contentWrapper            # Centered content wrapper (max-width: 1200px)
.mainCard                   # Main white card with backdrop blur
.layoutContainer            # Flexbox container for side-by-side layout
.leftSection               # Drag & drop section (flex: 1)
.rightSection              # Code input section (flex: 1.2)
.dragDropBox               # Styled drag & drop area
.codeInputSection          # Code editor container
.codeTextarea              # Styled textarea with custom scrollbars
.analyzeButton             # Gradient analyze button
.languageSelector          # Language dropdown styling
```

#### **Responsive Design**
```css
@media (max-width: 1023px) {
  .layoutContainer { flex-direction: column; }
}

@media (max-width: 768px) {
  /* Mobile optimizations */
}
```

---

## 🔧 **Configuration Files**

### **Backend Configuration**

#### **`package.json`** (Key Scripts)
```json
{
  "scripts": {
    "dev": "node --max-old-space-size=2048 node_modules/.bin/ts-node src/index.ts",
    "build": "tsc",
    "start": "node --max-old-space-size=2048 dist/index.js",
    "test": "jest"
  }
}
```

#### **`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```

### **Frontend Configuration**

#### **`vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,  // Updated from 8000
    host: true
  },
  base: '/code-reviewer/'
});
```

#### **`package.json`** (Key Scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🚀 **Build & Deployment Structure**

### **Development Environment**
```
Development Servers:
├── Backend: http://localhost:3001
├── Frontend: http://localhost:8001
└── API Endpoint: http://localhost:3001/api/code-review/analyze
```

### **Production Build Output**
```
backend/dist/              # Compiled TypeScript
frontend/dist/             # Optimized React build
├── index.html            # Entry point
├── assets/
│   ├── index-*.css       # Bundled styles (~9KB gzipped)
│   └── index-*.js        # Bundled JavaScript (~122KB gzipped)
```

### **Build Performance**
- **Backend Build**: ~2-3 seconds (TypeScript compilation)
- **Frontend Build**: ~4-5 seconds (Vite optimization)
- **Total Bundle Size**: ~387KB (122KB gzipped)

---

## 🔍 **Key Architecture Decisions**

### **Backend Choices**
- **Express.js**: Mature, well-documented web framework
- **TypeScript**: Type safety and better development experience
- **Memory Allocation**: 2048MB to handle complex regex operations
- **Port 3001**: Avoid conflicts with common development ports

### **Frontend Choices**
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool with excellent TypeScript support
- **CSS Modules**: Scoped styling without conflicts
- **Port 8001**: Avoid conflicts with other development servers

### **Styling Approach**
- **CSS Modules**: Component-scoped styles
- **Responsive Design**: Mobile-first approach
- **Custom Properties**: CSS variables for consistency
- **Performance**: Optimized animations and transitions

### **Testing Strategy**
- **Backend**: API integration tests with Supertest
- **Frontend**: Utility function tests with Jest
- **Coverage**: Focus on critical business logic

---

## 📊 **File Size Analysis**

### **Backend Files**
```
src/services/checks/sqlInjection.ts    ~4KB   # Core detection logic
src/routes/codeReview.ts               ~2KB   # API endpoints
src/index.ts                           ~1KB   # Server setup
tests/unit/sqlInjectionApi.test.ts     ~8KB   # Comprehensive tests
```

### **Frontend Files**
```
src/components/Analyzer.tsx            ~8KB   # Main analyzer component
src/styles/Analyzer.module.css         ~7KB   # Professional styling
src/utils/languageDetector.ts          ~4KB   # Language detection
src/components/ResultsPage.tsx         ~6KB   # Results display
```

### **Build Output**
```
backend/dist/                          ~50KB  # Compiled backend
frontend/dist/assets/index-*.js        ~388KB # Frontend bundle
frontend/dist/assets/index-*.css       ~9KB   # Styles bundle
```

---

## 🎯 **Future Structure Considerations**

### **Potential Additions**
```
backend/
├── src/middleware/        # Custom middleware
├── src/database/          # Database models and migrations
├── src/auth/             # Authentication logic
└── src/config/           # Configuration management

frontend/
├── src/hooks/            # Custom React hooks
├── src/context/          # React context providers
├── src/pages/            # Page-level components
└── src/assets/           # Images, icons, fonts
```

### **Microservices Split**
```
services/
├── analysis-service/     # Code analysis logic
├── auth-service/         # User authentication
├── report-service/       # PDF generation
└── api-gateway/          # Request routing
```

---

**Next Review**: 2024-12-20  
**Status**: Structure optimized for current features, ready for expansion 