# Welcome to your Langium VS Code Extension

## Get up and running straight away

 * Run `npm run langium:generate` to generate TypeScript code from the grammar definition.
 * Run `npm run build` to compile all TypeScript code.
 * Press `F5` to open a new window with your extension loaded.
 * Create a new file with a file name suffix matching your language.
 * Verify that syntax highlighting, validation, completion etc. are working as expected.
 * Run `node ./bin/cli` to see options for the CLI; `node ./bin/cli generate <file>` generates code for a given DSL file.

## Make changes

 * Run `npm run watch` to have the TypeScript compiler run automatically after every change of the source files.
 * Run `npm run langium:watch` to have the Langium generator run automatically after every change of the grammar declaration.
 * You can relaunch the extension from the debug toolbar after making changes to the files listed above.
 * You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Install your extension

* To start using your extension with VS Code, copy it into the `<user home>/.vscode/extensions` folder and restart Code.
* To share your extension with the world, read the [VS Code documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) about publishing an extension.

## To Go Further

Documentation about the Langium framework is available at https://langium.org
