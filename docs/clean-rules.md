# Antigravity Prompt – Code Cleanup & Structure Refactor

> **Goal:**
> Clean and refactor the project structure **without changing UI, behavior, logic, or functionality in any way**. This is a **structural cleanup only**, not a rewrite.

---

## 🚨 Hard Rules (Must Not Be Violated)

1. **DO NOT change**
   - UI appearance
   - Layout
   - Styling
   - Animations
   - Business logic
   - API calls
   - State behavior
   - Side effects
   - File behavior or outputs

2. **DO NOT**
   - Rename variables unless absolutely required for extraction
   - Change function logic
   - Change hook logic
   - Introduce new libraries or patterns
   - Convert hooks to props
   - Move hooks into `page.tsx`

3. **This is NOT an optimization task**
   - No performance optimizations
   - No memoization
   - No logic simplification
   - No refactoring for “cleaner logic”
   - Only structure & organization

---

## 📁 Required Folder Structure

For **every route/page**, enforce this structure:

```txt
components/
  [pageName]/
    [PageName].tsx
    hooks/
      use[Something].ts
    components/
      ...
app/
  [pageName]/
    page.tsx
```

---

## 📄 `page.tsx` Rules (Very Important)

- `page.tsx` must:
  - Import **one single component** from `components/[pageName]`
  - Render it directly
  - Contain **NO logic**
  - Contain **NO hooks**
  - Contain **NO props passing**
  - Contain **NO JSX except the root component**

### ✅ Allowed

```tsx
import Page from "@/components/home/HomePage";

export default function PageRoute() {
  return <Page />;
}
```

### ❌ Not Allowed

- Hooks in `page.tsx`
- Passing data as props
- Conditional logic
- Inline components

---

## 🪝 Hooks Rules

- All hooks must:
  - Live inside `components/[pageName]/hooks`
  - Be used **directly inside the page component**
  - NOT be lifted to `page.tsx`
  - NOT be passed down from `page.tsx` as props

### ✅ Correct

```tsx
const { data } = useHomeData();
```

### ❌ Incorrect

```tsx
// page.tsx
const data = useHomeData();
<HomePage data={data} />;
```

---

## 🧩 Component Rules

- The main page component (`[PageName].tsx`) must:
  - Own its hooks
  - Own its state
  - Own its logic
  - Import its own subcomponents

- Subcomponents may receive props **only if they already did before**

- Do NOT introduce new prop-drilling

---

## 🔧 Refactor Scope

### ✅ You ARE allowed to:

- Extract existing JSX into components
- Move logic into existing hooks **without changing their behavior**
- Reorganize files into the required structure
- Rename files/folders for consistency (not variables or logic)

### ❌ You are NOT allowed to:

- Rewrite hooks
- Combine hooks
- Split logic differently
- Change dependencies
- Change execution order

---

## ✅ Validation Checklist (Must Pass)

Before final output, verify:

- UI looks **pixel-identical**
- App behavior is **100% unchanged**
- No hooks exist in `page.tsx`
- Every page has a matching `components/[pageName]` folder
- `page.tsx` only renders one component
- Hooks are used directly inside components, not passed as props

---

## 📤 Output Requirements

- Show file structure **before & after**
- Show only **necessary code diffs**
- Do NOT reprint unchanged files
- Explain changes **briefly and structurally**, not logically

---

**Important:**
If any of the rules above cannot be satisfied, **STOP and report the conflict instead of making changes**.
