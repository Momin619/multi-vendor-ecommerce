---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

## Existing Frontend Redesign

When working on an existing frontend, treat the task as a visual redesign
of an already-functional product.

The goal is to significantly improve the visual identity, hierarchy,
layout, typography, spacing, responsiveness, and overall UX while
preserving existing functionality.

### UI-ONLY RULE

During an existing frontend redesign, ONLY modify the presentation layer.

Allowed:
- JSX structure when required for layout
- Tailwind classes
- CSS
- visual components
- component layout
- typography
- colors
- spacing
- borders
- shadows
- icons
- animations
- transitions
- responsive presentation

Do NOT modify:
- backend code
- API endpoints
- API request/response logic
- database logic
- business logic
- authentication
- authorization
- validation logic
- state-management logic
- data-fetching logic
- routing behavior
- form submission behavior
- filtering logic
- sorting logic
- pagination logic
- cart logic
- order logic
- product logic
- seller/customer permissions
- environment variables

Do not add new functionality.

Do not remove existing functionality.

Do not replace real data with mock data.

Do not create fake interactions.

If a visual change appears to require changing application logic,
find a presentation-only solution instead.

### Preserve Functional Contracts

When modifying an existing component:

- preserve its props
- preserve its state
- preserve its event handlers
- preserve its API calls
- preserve its hooks
- preserve its form behavior
- preserve its navigation behavior
- preserve its data flow

The component may be structurally reorganized for visual purposes, but
its functional behavior must remain unchanged.

### Existing Application Audit

Before making changes:

1. Inspect the entire frontend.
2. Identify every existing route/page.
3. Identify shared layouts and components.
4. Identify important interactive elements.
5. Identify forms and their behavior.
6. Identify loading, error, and empty states.
7. Identify responsive behavior.
8. Identify the existing visual patterns.

Create an internal map of the application before redesigning.

Do not start changing pages immediately.

### Redesign Strategy

Redesign the application as one cohesive product rather than designing
each page independently.

First establish:

- visual concept
- color system
- typography
- type scale
- spacing system
- layout system
- component language
- border/radius philosophy
- iconography
- interaction states
- motion principles

Then apply that system consistently across every existing page.

### Page Coverage

Redesign every existing frontend page that belongs to the application.

Do not redesign only the homepage.

For each page:

1. Understand its purpose.
2. Preserve all existing functionality.
3. Improve its visual hierarchy.
4. Improve layout and spacing.
5. Apply the shared design system.
6. Improve responsive behavior.
7. Preserve loading/error/empty states.
8. Review the rendered result.

### Visual Quality

Do not settle for minor cosmetic changes.

The redesigned application should feel intentionally redesigned,
not like the existing UI with different colors.

However, visual improvement must never come at the cost of functionality.

### Self-Critique

After implementing a page, inspect the rendered result.

Ask:

- Does the page have a clear visual hierarchy?
- Does it feel distinctive?
- Does it look like part of the same product as the other pages?
- Is anything visually unnecessary?
- Are spacing and alignment intentional?
- Does the design feel generic or AI-generated?
- Does the page work well at different screen sizes?

If the result feels generic, redesign it before continuing.

### Verification

After the redesign:

1. Run the frontend type checker.
2. Run existing tests.
3. Check all routes.
4. Check important interactions.
5. Check forms.
6. Check responsive layouts.
7. Inspect the final git diff.

The final git diff must contain only UI/presentation changes.

If non-UI logic was accidentally changed, revert those changes before
finishing.

Never claim functionality was verified unless it was actually checked.

## Ground your designs in the subject matter

If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is the first thing viewers will see. Open with the most characteristic thing in the subject's world, in the form that is most appropriate: a headline, an image, an animation, a live demo, an interactive moment, or other treatments. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the default treatment, so only use it if that's truly the best option.

Typography carries the personality of the page. You don't need a different typeface for display or headline text and body content: use one family or two, and if two, make them clearly distinct.

Choose your typefaces deliberately, not the default families you would reach for on any other project, and set a clear type scale following the default guidance of The Elements of Typographic Style with intentional weights, widths, and spacing. When type is used as a headline or visual element, use the type treatment itself as an active part of the design, not a neutral delivery vehicle for the content.

Default to line lengths of less than 80 characters. Serif typefaces can have slightly longer line lengths; give serif body text slightly more line-height than a sans-serif.

Avoid these default typographic treatments; they are the commonest tells of a generated page:
- Accenting just a single word or phrase in a headline, like putting one word in italic/bold or a different color.
- Using all caps for labels.
- Adding unnecessary typographic labels above content.

Visual structure is information. Structural devices like outlines, borders, numbering, eyebrows, dividers, labels, etc., encode useful information about the content rather than decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence — like a stepped process or a timeline. Before adding numbered markers, check the content really is a sequence.

Use non-user-triggered motion sparingly and deliberately, only to draw attention. A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy and placeholder content. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: plan, review against the brief, build, critique

For calibration, AI-generated design right now clusters around some traits:
1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
2. a near-black background with a single bright acid-green or vermilion accent;
3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.

All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.
- Color: describe the core base palette as 4–6 named hex values.
- Type: the typefaces and their roles.
- Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
- Principles: the high-level guidance for what makes this page unique.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and an element-based selector like .cta). This can happen often with padding/margin between sections.

## Restraint and self-critique

Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.

Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job.
