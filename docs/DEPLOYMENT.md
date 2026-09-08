# Deployment Guide

## 1. Purpose

This document defines the deployment and production-release approach for the Melbourne Photobooth Hire website.

It explains:

* deployment architecture
* hosting and domain responsibilities
* environments
* configuration and secrets
* deployment workflow
* production verification
* domain connection
* SEO/indexing setup
* third-party service verification
* rollback and recovery considerations
* deployment ownership and handoff

This document is intentionally implementation-aware but does not invent configuration values, environment variable names, DNS records, commands, or provider settings that have not yet been confirmed.

---

## 2. Deployment Principles

Deployment should prioritize:

1. Reliability
2. Security
3. Simplicity
4. Reproducibility
5. Maintainability
6. Production verification
7. Minimal infrastructure

The project should use the simplest deployment architecture that satisfies the agreed requirements.

Do not introduce additional hosting, backend, database, CI/CD, monitoring, or infrastructure services without a genuine requirement.

---

## 3. Deployment Architecture

The intended production architecture is:

```text
GitHub
   │
   ▼
Vercel
   │
   ├── Astro frontend
   ├── React interactive islands
   └── Astro server endpoints
           │
           ├── Supabase
           │     ├── PostgreSQL
           │     ├── Auth
           │     └── Storage
           │
           ├── EmailJS
           │     └── Client Gmail
           │
           └── Cloudflare Turnstile
```

Domain:

```text
melbournephotoboothhire.com.au
        │
        ▼
      Vercel
```

The exact production configuration remains an implementation concern and must be verified during deployment.

---

## 4. Hosting

### 4.1 Primary Hosting

The intended hosting platform is:

**Vercel**

Vercel is responsible for hosting and serving the production website and supporting the Astro server-side functionality required by the application.

No separate Express, NestJS, or other backend server is planned.

### 4.2 Source Control

The project source code is intended to be maintained in:

**GitHub**

The production deployment should be connected to the appropriate repository.

The exact repository, branch, and deployment configuration must be confirmed during implementation.

### 4.3 Hosting Principle

The production deployment should remain as close as practical to the repository's verified build.

Manual production changes should be avoided where the same configuration can be maintained through source control or the hosting platform's documented configuration.

---

## 5. Domain

The production domain is:

```text
melbournephotoboothhire.com.au
```

The domain registrar is:

**Namecheap**

The intended relationship is:

```text
Namecheap
   │
   │ DNS
   ▼
Vercel
   │
   ▼
melbournephotoboothhire.com.au
```

### 5.1 Domain Connection

The domain should be connected to the production Vercel project using the DNS configuration required by Vercel.

The exact DNS records must be taken from the active Vercel project rather than invented or copied from documentation.

### 5.2 Domain Verification

After configuration:

* verify the domain is recognized by Vercel
* verify HTTPS is active
* verify the canonical domain resolves correctly
* verify the site loads using the production domain
* verify unintended domains or preview URLs are not treated as the canonical public URL

### 5.3 WWW / Non-WWW

A single canonical hostname should be selected for the public website.

The alternate hostname should redirect to the canonical hostname where appropriate.

The final choice must match the production SEO configuration.

---

## 6. Environments

The project should distinguish between:

### Development

Used for:

* local development
* implementation
* debugging
* integration testing

### Preview

Used for:

* reviewing changes
* validating feature branches or pull requests
* client/internal review where appropriate

### Production

Used for:

* the live public website
* live CMS administration
* live inquiry submissions
* production third-party integrations

Production credentials and secrets must never be committed to the repository.

---

## 7. Environment Configuration

Environment-specific configuration may be required for:

* Supabase
* EmailJS
* Cloudflare Turnstile
* application configuration
* production domain/URL behavior
* optional analytics
* other approved third-party services

Exact environment variable names and values should be defined only when the implementation establishes them.

### 7.1 Secret Handling

Secrets must:

* remain outside source control
* be configured through the appropriate environment/configuration mechanism
* use separate values where development and production require different credentials
* never be exposed in client-side code unless the value is intentionally public
* never be included in documentation as a live credential

### 7.2 Public Configuration

Values that are intentionally safe for browser exposure must still be reviewed before being treated as public configuration.

The fact that a value is used by the frontend does not automatically make every related credential safe to expose.

---

## 8. Database and CMS Deployment

The CMS uses Supabase.

Production deployment must account for:

* production database
* Supabase Auth
* Row Level Security
* storage configuration
* production content
* administrator access
* required database policies

### 8.1 Production Database

Production data must not be casually replaced with development data.

Any database schema or policy changes must be reviewed before being applied to production.

### 8.2 CMS Access

The CMS is an administrative system and must not be treated as public content-editing functionality.

Production admin access must require authentication and appropriate authorization.

### 8.3 Content

Before launch, production CMS content should be reviewed for:

* business name
* contact information
* services
* service descriptions
* pricing where applicable
* gallery content
* FAQs
* calls to action
* Google review link
* SEO content
* legal/privacy content

No placeholder or development content should remain unintentionally on the live site.

---

## 9. Inquiry / Booking Deployment

The website uses an inquiry-based booking model rather than a complex reservation system.

The intended production flow is:

```text
Customer
   │
   ▼
Booking / Inquiry Form
   │
   ▼
Client-side validation
   │
   ▼
Server-side validation
   │
   ▼
Cloudflare Turnstile
   │
   ▼
EmailJS
   │
   ▼
Client Gmail
```

If inquiry persistence is explicitly implemented:

```text
                   ┌──► Supabase
                   │
Customer → Form → Validation
                   │
                   └──► EmailJS → Client Gmail
```

### 9.1 Production Verification

Before launch, verify:

* valid inquiries can be submitted
* invalid input is rejected
* required fields behave correctly
* spam protection works
* successful submissions provide appropriate user feedback
* failed submissions provide appropriate error feedback
* the client's Gmail receives the expected inquiry
* no sensitive information is unintentionally exposed
* duplicate or abusive submissions are appropriately handled

The exact email delivery configuration must be verified using the actual production EmailJS setup.

---

## 10. Third-Party Services

Production deployment may depend on:

* Supabase
* EmailJS
* Cloudflare Turnstile
* Google Business Profile
* Google Search Console
* Google Analytics 4, if implemented

Each third-party dependency must be tested independently where practical.

A successful website build does not prove that third-party integrations are functioning correctly.

---

## 11. Google Review Functionality

The website should use the client's Google Business Profile review destination.

It should not implement a custom review submission or review-storage system.

Before launch, verify:

* the review CTA is present where intended
* the link points to the correct client-owned Google review destination
* the link works from supported devices
* no development/test review destination remains

The final Google review URL must be confirmed before production launch.

---

## 12. SEO Deployment

Deployment is not complete until the production SEO foundation has been verified.

Verify:

### Technical SEO

* production canonical URLs
* correct page titles
* correct meta descriptions
* correct heading hierarchy
* semantic HTML
* internal links
* indexable public pages
* appropriate robots behavior
* XML sitemap
* structured data
* image alt text
* clean URLs
* HTTPS

### Local SEO

Verify that production content accurately represents:

* Melbourne service area
* business name
* contact information
* services offered
* relevant local search intent
* Google Business Profile connection where applicable

SEO implementation must not make unsupported claims about rankings or guaranteed search visibility.

---

## 13. Sitemap and Robots

The production website should expose the generated XML sitemap through the configured Astro sitemap implementation.

The production `robots.txt` must:

* allow intended public pages to be crawled
* avoid unintentionally exposing administrative areas to search engines
* reference the production sitemap where appropriate

The final sitemap and robots behavior must be tested against the production domain.

---

## 14. Structured Data

Schema.org structured data should be validated after deployment.

Where implemented, verify that:

* structured data reflects actual business information
* URLs point to the production domain
* schema does not contain placeholder data
* structured data does not make unsupported claims
* JSON-LD is valid

Structured data should describe real website/business information rather than being added solely to target search-engine features.

---

## 15. Google Search Console

After the production domain is connected and verified, the website should be submitted to:

**Google Search Console**

The production sitemap should be submitted where appropriate.

Initial verification should include:

* domain/property verification
* sitemap submission
* URL inspection of important pages
* indexing status
* mobile rendering/crawlability where available
* major indexing errors

Search Console configuration is part of launch readiness but does not guarantee indexing or rankings.

---

## 16. Analytics

If Google Analytics 4 is included in the final implementation, production analytics should be verified after deployment.

Verify:

* the correct production measurement configuration is used
* development/test traffic is not unintentionally treated as normal production data where avoidable
* page views are recorded
* intended inquiry/conversion events work if implemented
* no unnecessary personal information is sent to analytics

Analytics remains conditional on its inclusion in the implemented scope.

---

## 17. Accessibility Verification

Before production release, verify the live site for:

* keyboard navigation
* visible focus states
* usable form controls
* labels for form fields
* meaningful buttons and links
* sufficient text readability
* responsive behavior
* accessible error and success states
* appropriate alternative text
* reasonable screen-reader semantics

Accessibility verification should cover the production build, not only the development environment.

---

## 18. Performance Verification

Before launch, verify production performance for:

* page load behavior
* image sizes and formats
* unnecessary JavaScript
* layout stability
* responsive image behavior
* font loading
* animation impact
* Core Web Vitals where measurable

Performance work should focus on meaningful user experience improvements rather than premature optimization.

---

## 19. Security Verification

Production deployment must verify:

* admin authentication works
* unauthorized admin access is blocked
* Supabase authorization/RLS is correctly configured
* secrets are not exposed
* production credentials are not committed
* inquiry validation works server-side
* Turnstile is enforced where required
* unsafe user input is not rendered as trusted HTML
* error responses do not expose sensitive implementation details
* storage access follows the intended security model

Security requirements defined in `docs/SECURITY.md` remain authoritative for security concerns.

---

## 20. Production Release Workflow

The recommended workflow is:

```text
Implement
   ↓
Review
   ↓
Local verification
   ↓
Preview deployment
   ↓
Functional verification
   ↓
SEO/accessibility/performance verification
   ↓
Production configuration review
   ↓
Production deployment
   ↓
Domain verification
   ↓
Production smoke test
   ↓
Launch verification
```

A production deployment should not be considered complete merely because the build succeeds.

---

## 21. Pre-Deployment Checklist

### Application

* [ ] Production build succeeds
* [ ] No known blocking errors remain
* [ ] Public pages load correctly
* [ ] Navigation works
* [ ] Mobile layout works
* [ ] Interactive components work
* [ ] Forms work
* [ ] Loading states work
* [ ] Error states work
* [ ] Empty states are handled where relevant

### CMS

* [ ] Admin login works
* [ ] Unauthorized access is blocked
* [ ] Content editing works
* [ ] Content saves correctly
* [ ] Media handling works
* [ ] Production data is correct
* [ ] No test content remains unintentionally

### Inquiry

* [ ] Validation works
* [ ] Turnstile works
* [ ] EmailJS works
* [ ] Inquiry reaches client Gmail
* [ ] Success state works
* [ ] Failure state works
* [ ] Spam/abuse protections are active

### SEO

* [ ] Page titles verified
* [ ] Meta descriptions verified
* [ ] Canonicals verified
* [ ] H1/H2 structure verified
* [ ] Sitemap verified
* [ ] robots.txt verified
* [ ] Structured data verified
* [ ] Image alt text reviewed
* [ ] Internal links reviewed
* [ ] Production URLs verified

### Domain

* [ ] Production domain connected
* [ ] HTTPS active
* [ ] Canonical hostname verified
* [ ] Alternate hostname behavior verified
* [ ] No unintended preview URL is canonical

### Google

* [ ] Google Business Profile review CTA verified
* [ ] Search Console configured
* [ ] Sitemap submitted where appropriate
* [ ] Important pages inspected
* [ ] Analytics verified if implemented

### Security

* [ ] Secrets protected
* [ ] Admin authorization verified
* [ ] Supabase RLS verified
* [ ] Production configuration reviewed
* [ ] Error exposure reviewed
* [ ] Spam protection verified

---

## 22. Production Smoke Test

Immediately after deployment, perform a short production smoke test.

At minimum:

1. Open the homepage.
2. Open every primary public page.
3. Test navigation.
4. Test mobile navigation.
5. Test the primary inquiry flow.
6. Confirm inquiry delivery to the client's Gmail.
7. Open the CMS login.
8. Verify administrator authentication.
9. Verify a representative CMS content operation.
10. Open the production sitemap.
11. Open `robots.txt`.
12. Verify canonical URLs.
13. Verify the Google review CTA.
14. Verify HTTPS.
15. Check browser console/network errors for critical failures.

The smoke test should be performed against the real production domain.

---

## 23. Post-Deployment Monitoring

After launch, monitor for:

* broken pages
* failed forms
* failed email delivery
* CMS authentication issues
* unexpected database errors
* incorrect content
* indexing issues
* domain/DNS issues
* performance regressions
* third-party service failures

Monitoring should remain proportional to the size and requirements of the project.

A dedicated monitoring platform should not be introduced unless there is a demonstrated need.

---

## 24. Rollback and Recovery

The deployment process should allow a known-good version to be restored if a production release introduces a blocking issue.

Potential recovery mechanisms include:

* reverting the relevant source-code change
* redeploying a known-good application version
* correcting production configuration
* restoring or correcting affected database configuration/data where appropriate

Database changes require additional care because application rollback does not automatically reverse database changes.

Production data should not be deleted or reset as a first response to an application problem.

---

## 25. DNS and Domain Failure Considerations

If the site becomes inaccessible after domain configuration:

1. Verify the domain configuration in Vercel.
2. Verify the DNS records at Namecheap.
3. Verify DNS propagation.
4. Verify HTTPS/certificate status.
5. Verify the Vercel project is serving the expected deployment.
6. Verify the canonical hostname configuration.

Do not repeatedly change DNS records without first determining the current configuration and the expected target.

---

## 26. Third-Party Failure Considerations

The website should degrade gracefully where practical when third-party services fail.

Examples include:

### EmailJS failure

The customer should receive a clear submission failure state rather than being told an inquiry was successfully sent when delivery was not confirmed.

### Supabase failure

Administrative functionality should expose an appropriate error state without exposing internal database details.

### Turnstile failure

The inquiry flow should not silently bypass the intended spam-protection requirement.

### Google services

Google Review and Search Console functionality should not prevent the core website from loading if a Google service is temporarily unavailable.

---

## 27. Client Handoff

Before final handoff, confirm that the client has the information and access required to operate the deployed website.

This may include:

* CMS administrator access
* relevant Google access
* domain ownership/access where applicable
* hosting/project access where agreed
* required third-party service access
* documentation for normal CMS usage
* contact/process for reporting production issues

Credentials should never be stored directly inside this document.

---

## 28. Deployment Ownership

Deployment responsibilities should be explicitly understood between the developer and client.

The developer is responsible for implementing and verifying the agreed deployment configuration.

The client remains responsible for ownership and access to client-controlled services such as:

* domain registrar
* Google Business Profile
* Gmail
* Google Search Console
* other client-owned accounts

Exact access ownership must be confirmed rather than assumed.

---

## 29. Scope Boundaries

Deployment within the ₱15,000 project covers the deployment requirements necessary to make the agreed website operational.

It does not automatically include:

* ongoing server administration
* ongoing SEO campaigns
* guaranteed search rankings
* continuous content production
* backlink campaigns
* paid advertising
* complex monitoring infrastructure
* enterprise infrastructure
* custom DevOps systems
* ongoing maintenance beyond the agreed arrangement
* complex booking infrastructure
* CRM functionality

Additional requirements should be treated as separate scope unless explicitly agreed.

---

## 30. Known Confirmation Items

The following should be confirmed during implementation/deployment rather than assumed:

* final Vercel project
* final GitHub repository
* production branch
* exact production environment variables
* final Supabase production project
* Supabase production policies/RLS
* production EmailJS configuration
* final client Gmail destination
* Cloudflare Turnstile production configuration
* final Google Business Profile review URL
* final Google Search Console ownership
* whether Google Analytics 4 is included
* canonical hostname preference
* final DNS records provided by Vercel
* client/admin account ownership
* final production content
* launch approval

---

## 31. Deployment Acceptance Criteria

Deployment is considered ready when:

* the production domain resolves correctly
* HTTPS works
* the public website is functional
* responsive behavior is verified
* CMS authentication works
* CMS functionality works
* inquiry submission works
* inquiry delivery to the client's Gmail is verified
* spam protection works
* production content is correct
* SEO fundamentals are verified
* sitemap and robots behavior are verified
* canonical URLs are correct
* structured data is valid where implemented
* Google review CTA points to the correct destination
* critical security controls are verified
* no known blocking production defects remain
* the production smoke test passes

Deployment success means the agreed website is operational and verified. It does not imply guaranteed Google rankings or ongoing SEO performance.

---

## 32. Source-of-Truth Relationships

This document governs deployment concerns.

Other concerns remain owned by their respective documents:

* `PROJECT.md` — business/product context
* `REQUIREMENTS.md` — functional and non-functional requirements
* `TECH-STACK.md` — technology choices
* `ARCHITECTURE.md` — system architecture
* `UI-UX.md` — user experience and interface behavior
* `DESIGN-SYSTEM.md` — visual/design system rules
* `DATA-MODEL.md` — data model
* `API.md` — API contracts and boundaries
* `SECURITY.md` — security requirements
* `TESTING.md` — testing and verification strategy
* `DEVELOPMENT.md` — development workflow
* `DECISIONS.md` — recorded architectural/implementation decisions

This document must not silently override those sources.

Where a deployment decision affects another concern, the appropriate source document and `DECISIONS.md` should be updated when necessary.

---

## 33. Change Management

Deployment-related changes should follow the project's development workflow:

```text
Understand
   ↓
Inspect
   ↓
Plan
   ↓
Implement
   ↓
Review
   ↓
Verify
   ↓
Regress
   ↓
Report
```

Changes to production configuration should be treated with the same discipline as source-code changes.

Do not make production changes simply because they appear convenient.

---

## 34. Deployment Status

At the documentation stage, this document describes the intended deployment model and production-readiness process.

It does not claim that:

* the production deployment is already complete
* the domain is already connected
* DNS is already configured
* production credentials already exist
* third-party integrations are already verified
* Google Search Console is already configured
* production content is finalized

Those are implementation/deployment facts that must be verified when deployment occurs.

---

## 35. Final Principle

The goal of deployment is not merely to publish the website.

The goal is to publish a **secure, functional, maintainable, SEO-ready, client-operable production website** while keeping the infrastructure appropriate to the project's ₱15,000 scope.

When uncertain:

> Verify the current production configuration before changing it.
>
> Prefer the simplest working deployment.
>
> Never invent credentials, DNS records, provider settings, or production facts.
>
> Verify critical user journeys against the real production environment.
