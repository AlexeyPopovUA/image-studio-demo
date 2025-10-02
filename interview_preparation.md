## Pros

- Clear separation of concerns:
  - App Router pages under `src/app`
  - feature components in `src/components`
  - and reusable logic in `src/lib`
  - re-usable shadcn components `src/components/ui`
- Thoughtful editor UX:
  - derives defaults (size) from image metadata
  - persists only non‑default per‑image settings to `localStorage`
  - clamps input bounds
  - download button is disabled while image is downloading to protect against the rapid-fire clicks
  - explicit loading/error/empty states in the gallery
  - labeled controls in the editor improve UX and a11y
- Network efficiency in the editor:
  - preview updates are debounced to minimize network requests
  - preview dimensions are down‑scaled to make requests lighter, while preserving correct configuration
- Hosting simplicity:
  - static hosting: `next.config.ts` is set up for `output: "export"`
  - easy deployment on GitHub Pages
  - no server dependency required
- Testing:
  - minimal lightweight unit tests for URL building, pagination, and the download pipeline keep mission-critical logic correct
- Modern tooling and libraries:
  - pnpm package manager
  - comes in the box with Next.js framework
  - Latest React 19 + React compiler (improves rendering performance)
  - TailwindCSS and ShadCn help with fast prototyping


## Cons

- Client‑only fetching and no shared cache: both gallery and editor fetch directly from Picsum at runtime w/o server side cache. Examples:
  - https://picsum.photos/id/63/info
  - https://picsum.photos/v2/list?page=8&limit=9
- Pagination is too simple. No information about the items amount or total pages, so user never knows where is the last page until he gets to it.
- Rapid fire clicks on "next" and "prev" buttons cause a lot of requests of images and image lists. List request is cancellable, but image ones are not
- Preview requests: even with a 200ms debounce, sliding blur can still trigger multiple image requests and older requests aren’t canceled. Image loading process should be controlled from outside of next/image
- No loading state for image editor operations (blur and resize)
- Minimal observability and recovery: beyond inline messages there’s no retry policy, telemetry, or centralized error boundary.
- `localStorage` persistence is limited: many edited images on one device could theoretically exceed quota; there’s also no TTL or “reset all” control. IndexedDB or a persistence service could be a better alternative


## If I Had More Time

- Network performance:
  - Add smth like React Query on the client for simpler requests, re-trying, cancellation, better client side cache control
  - Increase debounce slightly (from 200ms to 300–500ms) and apply `AbortController` to image fetches
  - Consider option of UI-based image preview processing in web workers or via css filters, but keep the final result to be produced on backed (downloading)
  - Consider using service worker to keep the app responsive and alive during network issues
- UI issues:
  - Wire `hasNext/hasPrev` through `useGalleryImages` hook to `GalleryPagination`, so we could render ellipsis and disable prev/next buttons correctly
  - Add "reset all" button to remove all persisted objects from local storage
- Quality:
  - Add unit tests for critical areas
  - Add E2E tests for basic user journeys
  - Add more inline docs
- Refactoring:
  - Simplify views by splitting into smaller components
  - Simplify state management in hooks (use a bigger state objects or reducers)
  - Split hooks into multiple parts: fetching data, persistence and state preparation for views
  - Move request cancellation responsibility to libraries like react-query


## Scaling for Visitors number: What Breaks First, And How I’d Fix It

Likely first to break: external API 429 errors for client requests.

Situation:
  - a lot of users arrive to the same non-cached gallery pages
  - many same non-cached info requests from editor page

Short term fixes:
  - Increase quotas on existing services if possible
  - Add a server-side caching proxy for the image list and image info calls (Next route handler or a standalone service)
  - Add a CDN in front of that proxy
  - Add libraries like react-query and enable UI caching for requests
  - Add debounce time to preview requests
  - Organise a temporary on-call duty for mission-critical services

Long term fixes:
  - Switch to UI-based preview generation (web workers), ideally, sharing the same operation logic with backend
  - Add telemetry and error alarms for all controllable services

## Scaling for features and teams

Organization of repository:

- consider code splitting to modular monorepo
  - team is growing
  - easy code sharing
  - no resources to support separate micro front-ends
  - deployment speed of a full package is sufficient to satisfy teams needs
- consider micro frontends
  - supporting resources are available
  - sub apps are isolated and not necessary share a lot
  - deployment speed is different in different teams

Stack:

- Consider using state management systems
- Consider having minimal but sufficient re-usable parts for micro-frontends
- Organize a platform dedicated team to do the system support and transition

