# Design Pattern Registry — LegalAI

Living document of established UI patterns. Every component type has ONE canonical pattern. When `/create-ui` runs, it checks new designs against this registry.

---

## Status Badges

| Rule | Value |
|------|-------|
| Position | Right-aligned within parent card/row header |
| Size | `text-xs` / `12px`, `font-medium` (500) |
| Padding | `px-2 py-0.5` (8px horizontal, 2px vertical) |
| Shape | `rounded-full` (pill) |
| Variants | `success` (green bg/text), `warning` (amber), `error` (red), `info` (blue), `neutral` (gray) |
| Alignment | Vertically centered with the title/heading it accompanies |

## Section Headers

| Rule | Value |
|------|-------|
| Typography | H3 — `20px`, weight `500` (medium) |
| Spacing below | `sm` (16px) |
| Badge placement | Inline-right of title text, same baseline, `ml-2` gap |
| Action buttons | Far-right aligned, same row |
| Divider | None below header — spacing only |

## Card Layout

| Rule | Value |
|------|-------|
| Border | `1px solid rgba(27,54,93,0.05)` |
| Radius | `rounded-[12px]` |
| Padding | `p-4` (16px) or `p-6` (24px) for large cards |
| Header row | Title left, badge/actions right, `flex justify-between items-center` |
| Content gap | `space-y-3` (12px) between content sections |

## Buttons

| Rule | Value |
|------|-------|
| Primary | Navy bg `#1B365D`, white text, `rounded-[6px]` |
| Secondary | White bg, navy border, navy text, `rounded-[6px]` |
| Ghost | No bg, navy text, hover: `bg-gray-50` |
| Size consistency | Same padding (`px-4 py-2`) across all pages |
| Icon + text | Icon left, `gap-2`, icon size `16px` |

## Empty States

| Rule | Value |
|------|-------|
| Layout | Centered vertically and horizontally in container |
| Icon | Muted gray, `32-48px` |
| Heading | H3, Navy Primary |
| Subtext | Body, Prof Gray, max-width `400px`, centered |
| CTA | Primary button below subtext, `mt-4` |

## Loading States

| Rule | Value |
|------|-------|
| Skeleton | Match exact layout dimensions of populated state |
| Color | `bg-gray-100` with `animate-pulse` |
| Duration | Show skeleton for minimum 200ms to avoid flash |

## Sidebar Panels

| Rule | Value |
|------|-------|
| Width | Fixed or percentage — consistent across all sidebar instances |
| Section spacing | `space-y-6` (24px) between sections |
| Section headers | Uppercase `text-xs tracking-wider text-gray-500 font-medium` |
| Content padding | `px-4` or `px-6` — same across all sidebar panels |

## Tables / Lists

| Rule | Value |
|------|-------|
| Row height | Minimum `48px` |
| Row padding | `px-4 py-3` |
| Header style | `text-xs uppercase tracking-wider text-gray-500 font-medium` |
| Hover | `hover:bg-gray-50` |
| Selection | `bg-blue-50 border-l-2 border-blue-500` |

## Case Selector

| Rule | Value |
|------|-------|
| Icon | `Folder` from lucide-react, `size-4` (16px), color `#566573` |
| Text | `text-sm` (14px), `font-normal`, sentence case (display `caseName` as-is) |
| Text color | `#1B365D` (Navy Primary) |
| Chevron | `ChevronDown`, `size-4` (16px), color `#566573` |
| Gap | `gap-2` (8px) between icon/text/chevron |
| Layout | `flex items-center` |
| Sidebar variant | `px-3 py-2`, full width, `rounded-md` |
| Chat input variant | `px-2 py-1.5`, inline, `rounded-md` |
| Hover | `hover:bg-black/5` |
| Transition | `transition-colors` |
| Default text | "Select Case" (no case selected) |
| Truncation | `truncate` on case name, `max-w-56` in chat bar |

## Artifact Content

| Rule | Value |
|------|-------|
| Prose | `prose-sm prose-slate max-w-none leading-normal` |
| Wrapper padding | `p-3 sm:p-4 lg:p-6` |
| Text color | `#1B365D` via inline style |
| Editor variant | Same prose classes + `min-h-40 focus:outline-none` |
| Rendering | `Response` component from shadcn-io for markdown |

---

## How to Update This File

1. When `/create-ui` introduces a **new component type** not listed here, add its canonical pattern after user approval
2. When a pattern is **changed**, update this file AND list all affected pages in the design spec
3. Never delete a pattern — mark as `DEPRECATED: [reason]` with replacement reference

---

*Registry Version: 1.2*
