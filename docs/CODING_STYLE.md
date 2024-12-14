## Coding Style
Everything specified here will be applied by Prettier anyway when you commit, but I'm adding it here anyway fore completeness sake.

- There are 2 spaces per indent

- There are no trailing comma's
  - Correct: 
    ```typescript
    const data = [
      1,
      2,
      3 // <--- Notice how there's no trailing comma
    ]
    ```
  - Incorrect: 
    ```typescript
    const data = [
      1,
      2,
      3, // <--- Notice the trailing comma
    ]
    ```


**Naming variables**

- Variables are in camelCase

**Naming keys in objects**

- Use present tense (e.g., `search.useCustomEngine` instead of `search.usingCustomEngine`)
- Keys must be in camelCase
- For nested keys, avoid using the parent key in the child key's name
  - Wrong: `{ search: { useCustomSearchEngine: true } }`
  - Right: `{ search: { useCustomEngine: true } }`
  - If you are still confused, you can see many examples of this in `src/newtab/scripts/config.ts`

**Union Types**

- Union types will have each of its choices on a separate line
- E.g
  ```typescript
  type Modes = "normal" | "insert" | "visual";
  ```
- The last line of the union type should end with a semicolon

**Interfaces**

- Use PascalCase for interface names
- E.g
  - Correct:
    ```typescript
    interface ButtonSwitch {
      buttons: HTMLButtonElement[];
      attr: string;
    }
    ```
  - Wrong:
    ```typescript
    interface buttonSwitch {
      buttons: HTMLButtonElement[];
      attr: string;
    }
    ```
- Each key of the interface should be on a separate line
- Each key of the interface end with a semicolon
