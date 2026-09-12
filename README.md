# Melbourne Photobooth Hire

SEO-focused marketing website with a custom CMS/admin panel for a Melbourne-based photobooth business. The site presents services, packages, gallery, FAQs, and business information, and provides a booking/inquiry workflow for customer requests.

## 2. Overview

- Public-facing website for Melbourne Photobooth Hire, a Melbourne-based photobooth business.
- Audience: prospective customers researching photobooth services, and the business client managing site content.
- Main purpose: inform customers about services, packages, gallery, FAQs, and business details, and collect booking/inquiry requests.
- Includes both a public marketing website and a custom CMS/admin interface for client-managed content.

## 3. Project Scope

- Public-facing marketing website
- Services and packages pages
- Gallery
- About/business information
- FAQ
- Contact/inquiry functionality (booking/inquiry form)
- Custom CMS/admin panel
- Client-editable content
- Email inquiry delivery to the client's Gmail
- Google Review CTA/link
- SEO foundation
- Responsive frontend
- Deployment/domain setup

The booking system is an inquiry/request system, not a real-time reservation or availability platform.

## 4. Technology Direction

The following is the project's established technology direction. It does not imply every item is already implemented; implementation status should be confirmed from the repository.

### Frontend

- Astro
- React
- TypeScript
- Styled Components
- Lucide React
- Motion
- React Hook Form
- Zod

### Backend / API

- Astro Server Endpoints

### Database / CMS

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Custom CMS

### Email

- EmailJS
- Client's Gmail as the destination

### Security / Spam Protection

- Cloudflare Turnstile

### Hosting / Infrastructure

- Vercel
- Namecheap
- GitHub

### SEO / Google

- `@astrojs/sitemap`
- Schema.org JSON-LD
- Google Search Console
- Google Business Profile
- Google Analytics 4 (conditional only — only if confirmed and appropriate; not mandatory)
- Google Business Profile review link (requires client confirmation; no placeholder URL)

## 5. Architecture Overview

- Astro is the primary framework for content-heavy marketing pages.
- React is used for genuinely interactive UI components/islands.
- Supabase provides database, authentication, storage, and CMS functionality.
- Astro Server Endpoints provide backend/API functionality where required.
- EmailJS handles inquiry email delivery to the client's Gmail.
- Vercel handles deployment/hosting.

For detailed architectural information, see `docs/ARCHITECTURE.md`.

## 6. SEO Focus

SEO is an important project goal, with emphasis on local Melbourne photobooth search intent. Relevant areas include:

- Local SEO
- Search intent
- Semantic HTML
- Metadata
- Heading hierarchy
- Internal linking
- Image optimization
- Sitemap
- Robots.txt
- Canonical URLs
- Schema.org structured data
- Performance/Core Web Vitals
- Google Search Console
- Google Business Profile

No search rankings are promised. Ongoing SEO marketing, content campaigns, backlink campaigns, and ranking campaigns are separate from the website implementation unless explicitly requested.

## 7. Repository Documentation

Detailed project information is maintained in `docs/`.

| Document                | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `docs/PROJECT.md`       | Project purpose, scope, and product context |
| `docs/REQUIREMENTS.md`  | Functional and business requirements        |
| `docs/TECH-STACK.md`    | Technology choices and technical constraints |
| `docs/ARCHITECTURE.md`  | Application architecture and code organization |
| `docs/UI-UX.md`         | User experience and interaction requirements |
| `docs/DESIGN-SYSTEM.md` | Visual and component design rules           |
| `docs/DATA-MODEL.md`    | Database structure and relationships        |
| `docs/API.md`           | API and external service contracts          |
| `docs/SECURITY.md`      | Security requirements and constraints       |
| `docs/TESTING.md`       | Testing and verification strategy           |
| `docs/DEVELOPMENT.md`   | Local development workflow and commands     |
| `docs/ROADMAP.md`       | Development phase order and progression     |
| `docs/DEPLOYMENT.md`    | Deployment and production procedures        |
| `docs/DECISIONS.md`     | Important architectural and technical decisions |

## 8. Development Principles

Development should prioritize:

- Correctness
- Maintainability
- Simplicity
- Existing project conventions
- Minimal focused changes
- Verification
- Security
- Avoiding unnecessary dependencies and over-engineering

For detailed AI-agent development rules, see the root `AGENTS.md`.

## 9. Important Project Constraints

- Stay within the agreed project scope.
- Avoid unnecessary scope creep.
- Avoid over-engineering.
- The booking system should remain an inquiry/request workflow unless explicitly expanded.
- Do not introduce technologies without justification.
- Do not promise Google rankings.
- Ongoing SEO marketing is separate unless explicitly requested.

## 10. Brand Context

- Current brand: Melbourne Photobooth Hire.
- The previous Shot&Prints website may be used as reference material where appropriate.
- Shot&Prints is not the current brand identity.
- Do not introduce Shot&Prints branding into the new website unless explicitly required.

## 11. Status

Implementation status should be determined from the actual repository and relevant project documentation. Features listed in this README describe intended scope, not confirmed completion.

## 12. License / Ownership

> No open-source license has been specified for this project.
