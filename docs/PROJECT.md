# Melbourne Photobooth Hire — Project Context

This document is the primary product and business reference for the Melbourne Photobooth Hire project. It describes product purpose, business context, scope, customer journey, and known constraints.

It complements the root `README.md` (repository orientation) and `AGENTS.md` (development rules). Implementation details belong in the other `docs/` files referenced in Section 24.

## 1. Project Overview

* **Project name:** Melbourne Photobooth Hire
* **Project type:** SEO-focused marketing website with custom CMS/admin panel
* **Business type:** Melbourne-based photobooth business
* **Primary purpose:** attract and inform prospective customers and collect booking/inquiry requests
* **Secondary purpose:** allow the client to manage website content through the CMS

## 2. Business Context

* Melbourne Photobooth Hire provides photobooth experiences for events.
* The primary service area is Melbourne, with broader Victoria service considerations where applicable.
* The website is intended to support event-related customer inquiries.
* Relevant event types include weddings, birthdays, corporate events, engagements, school formals, Christmas/end-of-year events, and private events.

No additional business details are confirmed beyond the above.

## 3. Project Goals

### Customer-facing goals

* Clearly communicate available photobooth experiences.
* Explain packages and inclusions.
* Showcase real event imagery through the gallery.
* Answer common customer questions.
* Make it easy to submit an inquiry.
* Provide a clear path for customers to leave a Google review.
* Provide a professional and trustworthy user experience.

### Business goals

* Give the client control over website content through the CMS.
* Make inquiries easy to receive and manage.
* Establish a strong technical/local SEO foundation.
* Provide a maintainable website that can be expanded later if required.

No guaranteed conversions, rankings, or revenue are claimed.

## 4. Project Scope

### Public Website

* Homepage
* Services
* Packages
* Gallery
* About
* FAQ
* Contact/inquiry functionality
* Privacy Policy
* Terms & Conditions
* Supporting system pages where required, such as 404 or enquiry confirmation

### CMS / Admin

* Custom admin panel
* Client-editable website content
* Content management through Supabase-backed functionality
* Authentication for administrative access
* Media/file management where required by the implemented CMS

Specific CMS fields or modules are not documented here unless confirmed by the repository or project documentation.

### Inquiry System

The inquiry system should:

* Collect customer booking/inquiry details.
* Validate submitted information.
* Send inquiry information to the client's Gmail.
* Provide appropriate success/error feedback.
* Include spam protection where implemented.

This is not intended to be a full booking management or real-time availability system.

### SEO

The website should establish a strong technical and local SEO foundation. See Section 14.

### Deployment

* Production deployment
* Domain connection
* Production configuration

## 5. Target Customers

The primary audience is people looking for photobooth services for events in Melbourne and surrounding service areas.

Relevant customer groups include:

* Couples planning weddings
* People planning birthdays and milestone celebrations
* Corporate/event organizers
* People planning engagement parties
* School/formal event organizers
* Christmas/end-of-year event organizers
* Private event organizers

No demographic profiles, income levels, or personas are defined.

## 6. Customer Journey

### Discover

Customer finds the website through search, referrals, social media, Google Business Profile, or other channels.

### Explore

Customer reviews:

* Services
* Packages
* Gallery
* About information
* FAQs

### Decide

Customer evaluates the available photobooth experience and package options.

### Enquire

Customer submits an inquiry with relevant event details.

### Follow-up

The business receives the inquiry through Gmail and can respond to the customer.

### Booking

The final booking is handled through the business's normal process rather than through a complex online reservation engine.

No additional automated booking steps are defined.

## 7. Photobooth Experiences

The current content direction includes these service categories:

### Premium Photobooth

Positioned as the primary/open-air photobooth experience.

Known reference characteristics include:

* Open-air setup
* Studio-quality lighting
* Social/open experience
* Suitable for weddings, corporate events, and milestone birthdays
* Potential pairing with a 360 Video Booth

### Roaming Photobooth

A roaming experience where the photobooth is brought to guests.

Known reference characteristics include:

* Candid guest interaction
* No fixed backdrop required
* Suitable for events where guests are moving around

### 360 Video Booth

A 360-degree video experience intended as an additional photobooth experience or package option.

Important:

These service descriptions are based on the currently documented/reference content direction. Exact final service descriptions, pricing, inclusions, and availability should be confirmed against the latest project content before publication.

No technical specifications of the 360 system are defined.

## 8. Event Types

The website may present the service as suitable for:

* Weddings
* Birthday parties
* Corporate events
* Engagement parties
* School formals
* Christmas/end-of-year events
* Private events

Separate SEO landing pages for each event type should not be created unless explicitly required.

For the current project scope, event types can be represented within relevant website sections.

## 9. Packages and Pricing

Package information from the previous/reference website includes:

* Starter — 2 hours — $350
* Standard — 3 hours — $450
* Premium — 4 hours — $600

Reference inclusions included:

* Full photobooth service
* Studio-quality lighting/styling
* Custom-branded print template
* HD printing
* QR-code digital downloads
* Free props
* Optional on-site attendant depending on package/content
* Premium package reference to 360 Video Booth
* Priority setup/pack-down for Premium

Reference add-ons included:

* Professional Photography
* Extended Hire
* Custom Backdrop
* Digital Guestbook

Reference booking policy information included:

* 20% deposit to confirm booking
* Balance due on the event day
* Deposit described as non-refundable
* Rescheduling subject to notice

IMPORTANT:

The above pricing, inclusions, add-ons, and policies originated from the previous Shot&Prints website/reference material.

They must NOT automatically be treated as confirmed current Melbourne Photobooth Hire business requirements.

Before publishing them, verify them against current client-approved content.

Pricing and business policies must not be modified, reinterpreted, or invented.

## 10. Inquiry / Booking Model

The project uses an inquiry-based booking model.

The website should not be treated as a real-time reservation platform.

Recommended customer flow:

Customer → Inquiry Form → Validation → EmailJS → Client Gmail

If booking records are explicitly required by the implemented CMS:

Customer → Inquiry Form → Validation → Supabase + EmailJS → CMS record + Client Gmail

The second flow should only be implemented if booking record storage is actually required by the project.

Do not introduce:

* Real-time availability calendars
* Payment processing
* Online checkout
* Automated reservation allocation
* Complex CRM functionality
* Complex booking management

unless explicitly required later.

## 11. Inquiry Form Information

The intended inquiry form may collect:

* Name
* Email
* Mobile
* Event date
* Event type
* Event location/venue
* Estimated guests
* Preferred photobooth
* Additional requirements/message

Suggested event types:

* Wedding
* Birthday
* Corporate Event
* Engagement Party
* School Formal
* Christmas/End-of-Year
* Private Event
* Other

Suggested photobooth options:

* Premium
* Roaming
* 360
* Not Sure

Required fields should be determined by the final requirements and actual implementation.

No additional personal-data fields should be introduced without justification.

## 12. CMS Purpose

The custom CMS exists to allow the business client to manage website content without directly editing source code.

The CMS should prioritize:

* Ease of use
* Clear content organization
* Safe editing
* Predictable behavior
* Appropriate validation
* Authentication
* Maintainability

The CMS should not become a general-purpose enterprise CMS or CRM.

Specific editable content models are documented only once confirmed by the actual data model and requirements documentation.

## 13. Google Reviews

The website should not implement a custom review platform.

The intended approach is:

Website → Google Business Profile review link

The website may include a clear CTA encouraging customers to leave a review.

Do not:

* Build a custom review submission system.
* Store Google reviews unnecessarily.
* Invent review content.
* Claim Google ratings without verified current data.

## 14. SEO Objectives

The primary SEO objective is to establish a strong technical and local SEO foundation for relevant Melbourne photobooth search intent.

Relevant search intent includes:

* photobooth Melbourne
* photo booth hire Melbourne
* photobooth rental Melbourne
* wedding photobooth Melbourne
* 360 photobooth Melbourne
* corporate photobooth Melbourne
* event photobooth Melbourne
* photobooth hire near me

SEO implementation should consider:

* Search intent
* Local SEO
* Semantic HTML
* Proper heading hierarchy
* Unique metadata
* Internal linking
* Image optimization
* Accurate alt text
* XML sitemap
* robots.txt
* Canonical URLs
* Schema.org structured data
* Core Web Vitals
* Performance
* Google Search Console
* Google Business Profile
* Google reviews
* Relevant local content

No Google rankings are promised.

Ongoing SEO marketing, continuous content production, backlink campaigns, and ranking campaigns are outside the website implementation scope unless explicitly requested.

## 15. Website Information Architecture

The intended public website structure is:

* Home
* Services
* Packages
* Gallery
* About
* FAQ
* Contact
* Privacy Policy
* Terms & Conditions

Supporting pages may exist when technically necessary.

Unnecessary pages should not be created solely for SEO.

## 16. Content Strategy

The website should prioritize:

* Clear service information
* Customer-focused explanations
* Genuine business information
* Relevant local context
* Useful FAQs
* Real event imagery
* Natural search-intent coverage

Avoid:

* Keyword stuffing
* Unsupported claims
* Fake testimonials
* Invented business history
* Invented team/founder information
* Generic AI-generated claims presented as business facts

The previous Shot&Prints website may be used as a reference for existing business information, but its content must be treated as reference material and verified before being presented as current Melbourne Photobooth Hire information.

## 17. Brand Context

Current brand:

**Melbourne Photobooth Hire**

Previous/reference brand:

**Shot&Prints**

Shot&Prints is historical/reference context from the previous website.

It is not the current brand identity.

Shot&Prints branding, naming, contact information, logos, or brand language must not be used as current project information unless explicitly confirmed.

## 18. Service Area

Known service-area context:

* Melbourne
* Victoria

The previous website referenced Melbourne-wide and broader Victoria service.

Exact travel boundaries, travel fees, and service-area policies should be confirmed before being treated as current business requirements.

Suburbs, travel charges, or geographic coverage must not be invented.

## 19. Legal and Privacy Context

The project is expected to include:

* Privacy Policy
* Terms & Conditions

Legal content must reflect the actual implemented functionality and client-approved policies.

Legal obligations, contractual policies, insurance terms, cancellation terms, or data-retention periods must not be invented.

Security and privacy implementation details belong in `docs/SECURITY.md`.

## 20. Project Constraints

The project has a fixed agreed price of **₱15,000**.

Priorities:

1. Deliver agreed requirements.
2. Maintain a strong SEO foundation.
3. Provide good frontend/UI quality.
4. Provide a usable CMS.
5. Keep the implementation maintainable.
6. Avoid unnecessary infrastructure and dependencies.
7. Avoid scope creep.

The project should not become a complex booking platform, CRM, marketing automation system, or enterprise CMS unless the client explicitly expands the scope.

## 21. Out of Scope

Unless explicitly requested later, the following are outside the current website scope:

* Real-time booking availability system
* Online payment/checkout
* Complex booking engine
* Full CRM
* Marketing automation platform
* Custom Google review platform
* Guaranteed SEO rankings
* Ongoing SEO campaigns
* Ongoing backlink campaigns
* Continuous content marketing
* Large-scale SEO landing-page production
* Unnecessary third-party integrations
* Unnecessary architectural rewrites

This list defines current boundaries and can be updated when requirements change.

## 22. Current Project Status

Implementation status is not defined in this document.

The repository is the authoritative source for what is actually implemented.

The root `README.md` provides high-level repository orientation.

Detailed implementation status should be documented separately when appropriate.

## 23. Known Information vs. Information Requiring Confirmation

### Known / Established Project Direction

* Current brand is Melbourne Photobooth Hire.
* Project is an SEO-focused marketing website.
* Custom CMS/admin functionality is part of the scope.
* Inquiry form is part of the scope.
* Email delivery to the client's Gmail is part of the intended workflow.
* Google Review CTA uses the client's Google Business Profile review link.
* Local SEO is an important objective.
* The project should remain practical and maintainable.
* The agreed project price is ₱15,000.

### Requires Confirmation Before Publication or Implementation

* Final package pricing
* Final package inclusions
* Final add-ons
* Deposit and cancellation policies
* Exact service-area rules
* Travel fees
* Insurance claims
* Final business contact details
* Final testimonials/reviews
* Final service descriptions
* Final founder/team/company story
* Final legal policies
* Any business information carried forward from Shot&Prints

Reference information must not be converted into confirmed requirements without verification.

## 24. Related Documentation

* `README.md` — repository orientation
* `AGENTS.md` — AI-agent development rules
* `docs/PROJECT.md` — product and business context
* `docs/REQUIREMENTS.md` — functional/business requirements
* `docs/TECH-STACK.md` — technology decisions
* `docs/ARCHITECTURE.md` — architecture
* `docs/UI-UX.md` — UX requirements
* `docs/DESIGN-SYSTEM.md` — design system
* `docs/DATA-MODEL.md` — database/data structure
* `docs/API.md` — API/service contracts
* `docs/SECURITY.md` — security requirements
* `docs/TESTING.md` — testing strategy
* `docs/DEVELOPMENT.md` — development workflow
* `docs/DEPLOYMENT.md` — deployment procedures
* `docs/DECISIONS.md` — important decisions
