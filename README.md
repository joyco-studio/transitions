# <img src="./static/JOYCO.png" alt="JOYCO Logo" height="36" width="36" align="top" />&nbsp;&nbsp;JOYCO Transitions

![banner.png](./static/banner.png)

Plug & Play page transitions for React Router.

```bash
pnpm add @joycostudio/transitions
```

## 📖 Documentation

### Core Components

#### `RouteTransitionManager`

The main component responsible for managing route transitions. It wraps your route content and handles all transition states.

```tsx
<RouteTransitionManager
  routes={routes}
  pathname={location.pathname}
  mode="out-in"
  onEnter={{
    default: async (node) => {
      // Your enter animation
    },
  }}
  onExit={{
    default: async (node) => {
      // Your exit animation
    },
  }}
>
  {(nodeRef) => <div ref={nodeRef}>{/* Your route content */}</div>}
</RouteTransitionManager>
```

Props:

- `children`: Function that receives a ref to be attached to your route content
- `pathname`: Current route pathname
- `mode`: Transition mode ('out-in' | 'in-out')
- `onEnter`: Record of enter animations by route or default
- `onExit`: Record of exit animations by route or default
- `onEntering`: Optional callbacks when entering starts
- `onEntered`: Optional callbacks when entering completes
- `onExiting`: Optional callbacks when exiting starts
- `onExited`: Optional callbacks when exiting completes
- `appear`: Whether to animate on first render
- `routes`: Array of route configurations

#### `DocumentTransitionState`

A utility component that adds a `data-transition-state` attribute to the document root, useful for controlling UI elements during transitions.

```tsx
<DocumentTransitionState />
```

#### ✨ TIP | Lock links while transitioning
If you use the `<DocumentTransitionState />` component. It will attach a `data-transition-state` to the document's root. You can use it to disable all the links while the page is transitioning to make the experience feel more controlled.

```css
/* Disable links during transitions */
html:not([data-transition-state='idle']) a {
  pointer-events: none;
}
```

### Hooks

#### `usePreservedLoaderData<T>()`

Returns a frozen version of the loader data to prevent data changes during transitions.

```tsx
const data = usePreservedLoaderData<YourDataType>()
```

#### `useTransitionState()`

Returns the current transition state and helper flags.

```tsx
const {
  state, // 'entering' | 'exiting' | 'idle'
  isEntering, // boolean
  isExiting, // boolean
  isIdle, // boolean
} = useTransitionState()
```

<br/>

## 🤖 Automatic Workflows

This template comes with two GitHub Actions workflows (currently disabled for convenience):

1. **Release Workflow** (`.github/workflows/release.yml`): Automates the release process using Changesets. When enabled, it will automatically create release pull requests and publish to npm when changes are pushed to the main branch.

2. **Publish Any Commit** (`.github/workflows/publish-any-commit.yml`): A utility workflow that can build and publish packages for any commit or pull request.

<br/>

## 🦋 Version Management

This library uses [Changesets](https://github.com/changesets/changesets) to manage versions and publish releases. Here's how to use it:

### Adding a changeset

When you make changes that need to be released:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages you want to include in the changeset
2. Choose whether it's a major/minor/patch bump
3. Provide a summary of the changes

### Creating a release

To create a new version and update the changelog:

```bash
# 1. Create new versions of packages
pnpm version:package

# 2. Release (builds and publishes to npm)
pnpm release
```

Remember to commit all changes after creating a release.
