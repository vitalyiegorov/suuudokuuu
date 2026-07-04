# App Package (React Native)

Main Sudoku game application built with Expo 54, React 19 + Compiler, Expo Router 6, Redux Toolkit, Reanimated 4, and Lingui 5.7. Styling uses React Native `StyleSheet.create`.

## Commands

```bash
yarn start                    # Expo dev server
yarn ios                      # Run on iOS simulator
yarn android                  # Run on Android emulator
yarn web                      # Run on web

yarn i18n:sync                # Extract & compile i18n translations

# IMPORTANT: After modifying any user-facing text:
yarn i18n:sync
```

## Structure

```
src/
├── @generic/                 # Shared infrastructure
│   ├── app-root.store.ts     # Redux store + persistor setup
│   ├── components/           # Reusable UI components
│   ├── constants/            # Animation durations, theming
│   ├── hooks/                # useAppDispatch, useAppSelector, useVibration
│   ├── styles/               # Global styles
│   └── utils/                # i18n, date formatting utilities
├── app/                      # Expo Router routes (file-based routing)
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx             # Home screen
│   ├── game.tsx              # Game screen
│   ├── winner.tsx, loser.tsx # End screens
│   ├── pause.tsx             # Pause screen
│   ├── challenge-*.tsx       # Challenge mode routes
│   ├── history/              # Game history routes
│   └── shared/[url].tsx      # Deep link handling
├── game/                     # Sudoku gameplay logic
│   ├── context/              # GameContext (Sudoku instance)
│   ├── store/                # Redux slice (state, actions, selectors)
│   ├── components/           # Game UI (~14 components)
│   │   ├── field/            # Main 9x9 grid renderer
│   │   ├── field-cell/       # Individual cell with candidates
│   │   ├── available-values-item/ # Number pad (1-9)
│   │   └── game-timer/       # Elapsed time display
│   ├── hooks/                # useKeyboardControls, useSharePuzzle
│   └── utils/                # Game utilities
├── screens/components/       # Screen containers (~12 screens)
├── scoring/                  # Scoring system
│   ├── classes/              # SudokuScoring calculation
│   └── components/           # Score display UI
├── history/                  # Game history & statistics
├── challenge/                # Challenge mode (timed gameplay)
├── settings/                 # User preferences (theme, language, audio)
├── theme/                    # Theme system (Light/Dark/Newspaper)
│   ├── context/              # ThemeContext with CSS variables
│   └── themes/               # Theme definitions
└── locales/                  # i18n translations (en, uk, fr, de, es)
```

## React 19 Rules

1. **No manual memoization** - Never use `useCallback`, `useMemo`, `React.memo` (React 19 Compiler handles this)
2. **No displayName** - Never use `Component.displayName`
3. **No forwardRef** - React 19 handles ref forwarding natively. Accept `ref` as a regular prop:
   ```typescript
   // Good - React 19 native ref
   interface Props {
       ref?: RefObject<ViewRef>;
   }
   export const MyComponent = ({ ref, ...props }: Props) => { ... };

   // Bad - forwardRef
   export const MyComponent = forwardRef<ViewRef, Props>((props, ref) => { ... });
   ```

## Code Organization Rules

### No Complex Logic in JSX Props

Extract ternaries and logical operators to variables before JSX:
```typescript
// Good
const icon = isDefined(account) ? account.icon : 'Wallet';
<CircleIcon icon={icon} />

// Bad - Lint error
<CircleIcon icon={isDefined(account) ? account.icon : 'Wallet'} />
```

### Constants and Utilities

- **Constants** -> module's `constant/` folder
- **Utility functions** -> module's `utils/` folder with `.util.ts` suffix

## Component Patterns

### File Organization

- **One component per file** - Each in own folder: `component-name/component-name.tsx`
- **No barrel exports** - Direct imports only: `./component-name/component-name` not `./component-name`
- **Flat structure** - No deep nesting

### Component Logic Order

Organize component internals in this order, separated by blank lines:

```typescript
export const MyComponent = (props: Props) => {
    // 1. Props destructuring
    const { variant, onSelect, ...rest } = props;

    // 2. Framework hooks (router, i18n)
    const { t } = useLingui();
    const router = useRouter();

    // 3. State and refs
    const [search, setSearch] = useState('');

    // 4. External hooks (Redux selectors, custom hooks)
    const score = useAppSelector(gameScoreSelector);

    // 5. Handlers (handle* functions)
    const handlePress = () => { ... };

    // 6. Derived values and computed props
    const variant = isActive ? 'primary' : 'secondary';

    // 7. Effects
    useEffect(() => { ... }, []);

    // 8. Render
    return <View>...</View>;
};
```

### Props Patterns

**Destructuring** - For 5+ props, destructure in function body:
```typescript
// Good - Destructure in body for many props
export const MyComponent = (props: Props) => {
    const { style, header, footer, children, ...rest } = props;
};

// Good - Destructure in signature for few props
export const SimpleComponent = ({ title, onPress }: Props) => { ... };
```

### Event Handlers

Always extract handlers into named `handle*` methods:
```typescript
// Good
const handleClose = () => void ref.current?.close();
<Button onPress={handleClose} />

// Bad
<Button onPress={() => void ref.current?.close()} />
```

## Styling (StyleSheet)

### Styles in Sibling Files

Each component's styles live in a sibling `.styles.ts` file, exported as a single `StyleSheet.create` constant named `<ComponentName>Styles`:

```typescript
// game-timer.styles.ts
import { StyleSheet } from 'react-native';

export const GameTimerStyles = StyleSheet.create({
    text: {
        fontWeight: 'bold'
    }
});
```

```typescript
// game-timer.tsx
import { GameTimerStyles as styles } from './game-timer.styles';

<BlackText style={styles.text}>...</BlackText>
```

Shared styles live in `src/@generic/styles/` (e.g. `cell.styles.ts`).

### Conditional and Dynamic Styles

Use `cs()` from `@rnw-community/shared` for conditional styles, combined with dynamic values in a style array:

```typescript
import { cs } from '@rnw-community/shared';

const textStyles = [
    { color: getCellTextColor() },
    cs(isActive, styles.textActive),
    { fontSize: CellFontSizeConstant * fontSizeMultiplier }
];

<Reanimated.Text style={textStyles}>{text}</Reanimated.Text>
```

### Theme Colors

Never hardcode colors - read them from `ThemeContext`:

```typescript
import { use } from 'react';
import { ThemeContext } from '../../../theme/context/theme.context';

const { theme } = use(ThemeContext);

const color = theme.colors.cell.activeText;
```

## State Management (Redux Toolkit)

### Store Structure

- `game/store/game.slice.ts` - Game state (sudokuString, score, mistakes, moves, candidates)
- `settings/store/settings.store.ts` - User preferences (theme, language, audio, timer)
- `history/` - Game history records

### Hooks

- `useAppDispatch` / `useAppSelector` from `@generic/hooks/`
- Selectors: `gameScoreSelector`, `gameMistakesSelector`, etc.

## Routing (Expo Router)

- **One component per route file**
- **Route groups:** `(tabs)` (visible tab bar), `(main)` (hidden tab bar)
- **Dynamic routes:** `history/[difficulty]/[completedAt].tsx`
- **Deep links:** `shared/[url].tsx` for puzzle sharing

## i18n (Lingui)

- **Use `<Trans>` in JSX**: `<Trans>Category</Trans>`
- **Use `t\`template\`` for non-JSX**: toasts, aria-labels, placeholder text
- **5 locales:** en, uk, fr, de, es
- **After changes:** `yarn i18n:sync`

## ESLint Disable Guidelines

For components that exceed `max-statements` (14), add disable comment:
```typescript
// eslint-disable-next-line max-statements -- Form orchestration component with multiple hooks and handlers
export const GameScreen = (props: Props) => { ... };
```

## Provider Architecture

Root layout providers (in `_layout.tsx`):
1. SafeAreaProvider
2. Redux Provider + PersistGate
3. ThemeProvider
4. I18nProvider
