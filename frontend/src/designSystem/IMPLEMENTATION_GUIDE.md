# Prisma Design System - Implementation Guide

## Overview

The Prisma Design System is a comprehensive, accessible, and modern UI design system built for enterprise applications. It provides a complete set of design tokens, components, and patterns to ensure consistency across the product.

### Quick Links
- **Tokens**: `/src/designSystem/tokens/`
- **Components**: `/src/designSystem/components/`
- **Styles**: `/src/designSystem/styles/`

---

## Design Tokens

### Color System

All colors are defined in `/src/designSystem/tokens/colors.js` and available as CSS variables in `/src/designSystem/styles/tokens.css`.

**Usage:**

```javascript
// JavaScript
import { colors } from 'designSystem/tokens';
const primaryColor = colors.accent.electric; // #00d9ff

// CSS
.element {
  background-color: var(--color-accent-electric);
  color: var(--color-text-primary);
}
```

### Typography

Font sizes, weights, and line heights are defined in `/src/designSystem/tokens/typography.js`.

**Available Sizes:**
- `displayLarge` (48px, 700 weight)
- `displayMedium` (40px, 700 weight)
- `headingLarge` (32px, 700 weight)
- `headingMedium` (24px, 600 weight)
- `headingSmall` (20px, 600 weight)
- `bodyLarge` (16px, 400 weight)
- `bodyMedium` (14px, 400 weight)
- `bodySmall` (12px, 400 weight)
- `codeLarge` (14px, monospace)
- `codeSmall` (12px, monospace)
- `labelMedium` (12px, 600 weight, uppercase)

### Spacing

Base unit: **8px**

Available sizes: `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px), `xxl` (32px), `3xl` (48px), `4xl` (64px)

```css
.element {
  padding: var(--space-lg); /* 16px */
  margin-bottom: var(--space-xl); /* 24px */
  gap: var(--space-md); /* 12px */
}
```

### Shadows

Five elevation levels:
- `depth0` - No shadow
- `depth1` - Subtle (buttons, inputs)
- `depth2` - Medium (cards, panels)
- `depth3` - High (modals, popovers)
- `depth4` - Maximum (full-screen overlays)

```css
.card {
  box-shadow: var(--shadow-depth2);
}
```

### Animations

**Durations:**
- `fast` (100ms) - Hover effects
- `standard` (200ms) - UI state changes
- `slow` (300ms) - Page transitions
- `extraSlow` (500ms) - Entrance animations

**Easing Functions:**
- `linear` - Constant speed
- `easeOut` - Quick start, smooth end
- `easeIn` - Slow start, quick end
- `easeInOut` - Smooth both ends

```css
.element {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Components

### Button

The primary action component.

```jsx
import { Button, BUTTON_VARIANTS, BUTTON_SIZES } from 'designSystem/components';

// Basic button
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="large">Save</Button>

// With icon
<Button icon={<SaveIcon />} iconPosition="left">Save Document</Button>

// Loading state
<Button loading>Processing...</Button>

// Secondary variant
<Button variant="secondary">Cancel</Button>

// Tertiary (minimal)
<Button variant="tertiary">Learn more</Button>

// Disabled
<Button disabled>Unavailable</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'tertiary'
- `size`: 'small' | 'medium' | 'large' | 'extraLarge'
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean
- `onClick`: function

### TextInput

Text input with label, helper text, error handling.

```jsx
import { TextInput } from 'designSystem/components';

<TextInput
  label="Email Address"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  helperText="We'll never share your email"
/>

// With error
<TextInput
  label="Password"
  type="password"
  error="Password is required"
  errorIcon={<ErrorIcon />}
/>

// With success
<TextInput
  label="Username"
  success
  successIcon={<CheckIcon />}
/>

// Disabled
<TextInput
  label="Field"
  disabled
  value="Read only value"
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string (shows error state)
- `success`: boolean
- `disabled`: boolean
- `helperText`: string
- `type`: string (default: 'text')
- `required`: boolean

### Checkbox

Binary selection component.

```jsx
import { Checkbox } from 'designSystem/components';

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// Disabled
<Checkbox label="Disabled option" disabled />

// Indeterminate (for "select all")
<Checkbox indeterminate label="Select all" />
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: function
- `disabled`: boolean
- `indeterminate`: boolean

### Radio

Single selection from group.

```jsx
import { Radio } from 'designSystem/components';

<div>
  <Radio
    name="option"
    value="option1"
    label="Option 1"
    checked={selected === 'option1'}
    onChange={(e) => setSelected(e.target.value)}
  />
  <Radio
    name="option"
    value="option2"
    label="Option 2"
    checked={selected === 'option2'}
    onChange={(e) => setSelected(e.target.value)}
  />
</div>
```

**Props:**
- `name`: string (required)
- `value`: string (required)
- `label`: string
- `checked`: boolean
- `onChange`: function
- `disabled`: boolean

### Badge

Status indicators and tags.

```jsx
import { Badge } from 'designSystem/components';

// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>

// Closeable badge
<Badge closeable onClose={() => removeBadge()}>
  Tag
</Badge>

// Outline style
<Badge outline variant="info">Optional</Badge>

// Sizes
<Badge size="small">Small</Badge>
<Badge size="medium">Medium</Badge>
<Badge size="large">Large</Badge>
```

**Props:**
- `variant`: 'success' | 'warning' | 'error' | 'info' | 'neutral'
- `size`: 'small' | 'medium' | 'large'
- `outline`: boolean
- `closeable`: boolean
- `onClose`: function

### Card

Container with header, content, and footer.

```jsx
import { Card } from 'designSystem/components';

// Basic card
<Card>
  This is card content
</Card>

// With header and footer
<Card
  header="Card Title"
  footer="Footer information"
>
  Card content goes here
</Card>

// Interactive card
<Card
  interactive
  onClick={() => handleCardClick()}
  header="Clickable Card"
>
  Click me to interact
</Card>

// With elevation
<Card elevation="depth3">
  High elevation card
</Card>
```

**Props:**
- `header`: ReactNode
- `footer`: ReactNode
- `elevation`: 'depth0' | 'depth1' | 'depth2' | 'depth3' | 'depth4'
- `interactive`: boolean
- `onClick`: function

---

## CSS Variables

All design tokens are available as CSS variables in `:root`:

```css
/* Colors */
--color-bg-primary: #0f1117;
--color-text-primary: #e6edf3;
--color-accent-electric: #00d9ff;
--color-status-success: #10b981;

/* Typography */
--font-family-sans: system fonts...
--font-size-base: 16px;
--font-weight-bold: 700;

/* Spacing */
--space-sm: 8px;
--space-lg: 16px;

/* Shadows */
--shadow-depth1: 0 1px 3px ...
--shadow-focus: 0 0 0 3px ...

/* Transitions */
--transition-standard: all 200ms ...
```

---

## Responsive Design

Breakpoints:
- `xs`: 0px (Mobile)
- `sm`: 641px (Mobile Landscape)
- `md`: 769px (Tablet)
- `lg`: 1025px (Desktop)
- `xl`: 1281px (Large Desktop)
- `2xl`: 1537px (Ultra-wide)

**Example:**

```css
.element {
  padding: 12px; /* Mobile */
}

@media (min-width: 769px) {
  .element {
    padding: 24px; /* Tablet and up */
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

All components support:
- **Keyboard navigation** - Fully operable with keyboard
- **Focus indicators** - Clear 2px cyan outline
- **Color contrast** - 4.5:1 minimum for text
- **ARIA labels** - Proper semantic HTML and ARIA attributes
- **Screen readers** - All content announced properly

### Using Components Accessibly

```jsx
// Always provide aria-label for icon buttons
<Button icon={<SaveIcon />} aria-label="Save document" />

// Associate labels with inputs
<TextInput label="Email" placeholder="your@email.com" />

// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Header</h2>

// Provide error messages linked to inputs
<TextInput error="Email is required" />
```

---

## Styling Approach

### CSS Modules

Components use CSS Modules for local scoping:

```jsx
import styles from './Component.module.css';

<button className={styles.button}>
  Click me
</button>
```

### Using Design Tokens in CSS

```css
.element {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-medium);
  transition: var(--transition-standard);
  box-shadow: var(--shadow-depth2);
}
```

---

## Creating New Components

Follow this structure for new components:

```
/src/designSystem/components/NewComponent/
  ├── NewComponent.jsx      # React component
  ├── NewComponent.module.css # Styles
  ├── NewComponent.types.js  # PropTypes definitions
  └── index.js              # Export file
```

**Component Template:**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './NewComponent.module.css';

const NewComponent = React.forwardRef(
  ({ children, className = '', ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.component} ${className}`}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = 'NewComponent';

NewComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default NewComponent;
```

---

## Best Practices

### Do's ✓
- Use design tokens for all colors, spacing, and typography
- Test components at all responsive breakpoints
- Include proper ARIA labels and semantic HTML
- Use CSS variables for consistent styling
- Test keyboard navigation
- Provide clear error messages
- Use focus visible styles

### Don'ts ✗
- Don't hardcode colors - use CSS variables
- Don't use arbitrary spacing values - use spacing scale
- Don't remove focus indicators
- Don't rely on color alone for status indication
- Don't forget alt text for images
- Don't break keyboard navigation
- Don't make animations loop infinitely without user control

---

## Integration

### Import in React Components

```jsx
import { Button, TextInput, Card, Badge } from 'designSystem/components';
```

### Import Design Tokens

```jsx
import { colors, spacing, typography } from 'designSystem/tokens';
```

### Import CSS Variables

```javascript
// Add to your main app file
import 'designSystem/styles/tokens.css';
```

---

## File Structure

```
/src
├── /designSystem
│   ├── /tokens
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   ├── shadows.js
│   │   ├── borders.js
│   │   ├── animations.js
│   │   ├── breakpoints.js
│   │   └── index.js
│   ├── /components
│   │   ├── /Button
│   │   ├── /TextInput
│   │   ├── /Checkbox
│   │   ├── /Radio
│   │   ├── /Card
│   │   ├── /Badge
│   │   └── index.js
│   ├── /styles
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── themes.css
│   └── IMPLEMENTATION_GUIDE.md
```

---

## Support & Questions

For design system questions or component requests:
1. Check this documentation
2. Review component examples
3. Check component PropTypes
4. Create a GitHub issue

---

## Version History

**v1.0.0** - Initial release
- 45+ components specified
- Complete design tokens
- WCAG 2.1 AA accessibility
- Responsive design support
- Dark mode support

---

**Last Updated:** November 2024
**Status:** Production Ready
