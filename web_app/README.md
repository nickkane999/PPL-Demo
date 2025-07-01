npm run# PPL Electric Utilities - Demo Application

A demonstration of modern web development capabilities for PPL Electric Utilities' digital transformation initiative, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Implemented

- **Next.js 15** with App Router and Server Components
- **TypeScript** for complete type safety
- **Tailwind CSS** for consistent, responsive design
- **Component Architecture** following established patterns
- **Accessibility-first** design with semantic HTML
- **Responsive Design** for all device sizes
- **CMS Integration Ready** structure for Storyblok
- **Performance Optimized** for Core Web Vitals

### 🏗️ Key Pages

- **Home Page** - Hero section, service cards, alerts system
- **Outages** - Power outage management and reporting
- **Account** - Customer account management dashboard
- **About** - Technical documentation and features

## 🛠️ Technical Architecture

### Component Structure

Following the established `.cursorrules` patterns:

- **Single Props Pattern**: All components use `{ props }: { props: ComponentProps }`
- **Config Files**: All interfaces and types in `config.ts`
- **UI Utilities**: Styling functions and components in `ui/ui.tsx`
- **Custom Hooks**: Logic separation with custom hooks

### File Organization

```
web_app/
├── app/
│   ├── config.ts              # TypeScript interfaces
│   ├── page.tsx               # Home page component
│   ├── ui/
│   │   └── ui.tsx             # UI utilities and components
│   ├── outages/
│   │   └── page.tsx           # Outage management page
│   ├── account/
│   │   └── page.tsx           # Account management page
│   └── about/
│       └── page.tsx           # About/demo information page
├── hooks/
│   └── useHomePage.ts         # Home page logic hook
├── lib/
│   └── cms.ts                 # CMS client and mock data
└── components/                # Shared components (future)
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (600-700 range)
- **Success**: Green (600-700 range)
- **Warning**: Yellow/Orange (600-700 range)
- **Error**: Red (600-700 range)
- **Neutral**: Gray (50-900 range)

### Component Types

- **Service Cards**: Interactive cards with icons and hover effects
- **Alert Components**: Dismissible notifications with different severity levels
- **Navigation**: Consistent header/footer across all pages
- **Buttons**: Primary, secondary, and ghost variants
- **Form Elements**: Accessible inputs with proper labeling

## 🔗 CMS Integration (Ready)

### Storyblok Integration Structure

- **Client Configuration**: `lib/cms.ts` with API client setup
- **Content Types**: Interfaces for Hero, Services, Alerts
- **Mock Data**: Realistic sample content for development
- **Component Mapping**: Ready for Storyblok component integration

_Note: Storyblok packages temporarily removed due to React 19 compatibility. Will be added when Storyblok updates their React 19 support._

### Planned CMS Content Types

```typescript
// Hero Section
interface HeroSectionInterface {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image?: string;
}

// Service Cards
interface ServiceCardInterface {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
}

// Alert System
interface AlertInterface {
  id: number;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  link?: string;
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development URLs

- **Development**: http://localhost:3000
- **Home**: /
- **Outages**: /outages
- **Account**: /account
- **About**: /about

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features

- Mobile-first responsive design
- Touch-friendly interface elements
- Optimized for all screen sizes
- Progressive enhancement

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance

- Semantic HTML structure
- Proper heading hierarchy (h1-h6)
- Alt text for all images
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader compatibility

### Testing

- Automated accessibility testing ready
- Manual testing checklist included
- ARIA patterns implemented correctly

## 🎯 Performance Optimizations

### Next.js 15 Features

- **Server Components** for faster initial loads
- **Streaming** for progressive page rendering
- **Image Optimization** with Next.js Image component
- **Font Optimization** with next/font
- **Bundle Splitting** for optimal loading

### Metrics Targets

- **Lighthouse Performance**: >90
- **First Contentful Paint**: <1.8s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

## 🧪 Testing (Future)

### Planned Testing Strategy

- **Unit Tests**: Jest + Testing Library
- **E2E Tests**: Playwright
- **Accessibility Tests**: axe-core
- **Performance Tests**: Lighthouse CI

## 🚢 Deployment Ready

### Environment Variables

```bash
# CMS Configuration
STORYBLOK_API_TOKEN=your_api_token
STORYBLOK_PREVIEW_TOKEN=your_preview_token
STORYBLOK_SPACE_ID=your_space_id
NEXT_PUBLIC_STORYBLOK_VERSION=draft
```

### Build Configuration

- **Next.js Config**: Optimized for production
- **TypeScript**: Strict mode enabled
- **Tailwind**: Purging for minimal CSS bundle
- **Image Optimization**: Built-in Next.js optimization

## 📈 Future Enhancements

### Phase 2 Features

- [ ] Full Storyblok CMS integration
- [ ] User authentication system
- [ ] Real-time outage data integration
- [ ] Bill payment processing
- [ ] Energy usage visualization
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Dark mode theme

### Advanced Features

- [ ] Service worker for offline functionality
- [ ] Progressive Web App (PWA) capabilities
- [ ] API integrations for real utility data
- [ ] Advanced analytics and reporting
- [ ] Customer portal with full account management

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices for PPL Electric Utilities. The architecture supports easy extension and modification following established patterns.

### Code Standards

- Follow `.cursorrules` patterns strictly
- TypeScript for all new code
- Accessibility-first development
- Component-driven architecture
- Comprehensive testing

## 📄 License

This is a demonstration project for PPL Electric Utilities.

---

**Built with ❤️ for PPL Electric Utilities' Digital Transformation Initiative**
