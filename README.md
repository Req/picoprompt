# SYNOPSIS

A very simple sync prompt for node **for educational purposes**.

The goal of this fork is to be as simple as possible for usage in education. It enables students to practice with simple user inputs, without deeply learning about callbacks or promises. ESM only.

## Installation

- Install with `npm install promptin`
- Add `"type": "module"` into package.json

- Minimal example of `package.json`

    ```json
    {
        "type": "module",
        "dependencies": {
            "promptin": "^5.0.0"
        }
    }
    ```

## Usage

```js
import prompt from 'promptin'

const name = prompt('What is your name? ')
console.log(`Hello ${name}!`)
```

## Line editing

Use backspace and left/right arrows for editing.
