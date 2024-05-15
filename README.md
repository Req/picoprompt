# SYNOPSIS

A very simple sync prompt for node **for educational purposes**.

The goal of this fork is to be as simple as possible for usage in education. It enables students learning programming to very, very simple create inputs without learning about callbacks or promises. ESM only.

No configuration, no history, no answer typing, a single upstream dependency.

## Installation

`npm i promptin`

## Usage

```js
import prompt from 'promptin'

const name = prompt('What is your name? ')
console.log(`Hello ${name}!`)
```

## Line editing

Use backspace and left/right arrows for editing.
