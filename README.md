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

One property of fourtune is that it makes opinionated choices about your source code and project structure, therefore streamlining project development.

This tool was born to bootstrap the [anio.software](https://github.com/anio-software) project.

## How to use it

First make sure to have `node` and `npm` installed.

After this, you can install fourtune locally in your project:

`$ npm install --save-dev fourtune`

fourtune uses "realms" to differentiate between project types.

For a TypeScript library project you want to install `@fourtune/realm-js`:

`$ npm install --save-dev @fourtune/realm-js`.

## Supported Languages and Environments

• [TypeScript](https://github.com/fourtune-org/realm-js) (both node and web [web coming soon])

• C (coming soon)

## The principle behind fourtune

The basic principle of fourtune remains the same regardless of realm:

Source files are pre-processed, converted into one or more object file(s) and are then
combined into distributables.

One or more distributable make up a product.

For example, in a TypeScript project, a single `input.mts` file will be converted into two object files: `input.d.mts` and `input.mjs`.

In a C project, a single `input.c` file will be converted into one file: `file.o`.

In a web project, a single `Component.vue` file may be converted into three files: `Component.css`, `Component.mjs` and `Component.d.mts`.

## Why realm dependencies are not part of the `package.json` / `package-lock.json`

This has more than one reason, but the main reason is that some packages (like `rollup`) install dependencies 
that are dependent on the properties of your development machine (for example architecture or operating system).

Since every dependency will be recorded in the `package-lock.json` installation may fail on a different system (like ci/cd environment).

This **is** fixable but requires to fiddle with the `package.json`, not something I want or expect users to do.

In order to prevent that for happening, an abstraction layer (called `@fourtune/core`) is used that installs realm dependencies in the `.fourtune/` folder.

