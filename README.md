# 🍀 fourtune project builder

> [!WARNING]  
> 🚧 This project is still heavily under construction and not ready for any real serious project.

## What is fourtune?

`fourtune` is a project builder written in JavaScript (soon to be written in TypeScript) 
that aims to build projects across various environments and languages.

fourtune aspires to handle the full stack of software development:

• software testing (e2e, unit etc.)

• software documentation

• ci/cd

## How to use it

First make sure to have `node` and `npm` installed.

After this, you can install fourtune locally in your project:

`$ npm install --save-dev fourtune @fourtune/core`

## Supported Languages and Environments

• TypeScript (both node and web [web coming soon])

• C (coming soon)

## The principle behind fourtune

The basic principle of fourtune remains the same regardless of realm:

Source files are pre-processed, converted into one or more object file(s) and are then
combined into distributables.

One or more distributable make up a product.

For example, in a TypeScript project, a single `input.mts` file will be converted into two object files: `input.d.mts` and `input.mjs`.

In a C project, a single `input.c` file will be converted into one file: `file.o`.
