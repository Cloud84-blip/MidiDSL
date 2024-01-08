import { NodeFileSystem } from 'langium/node';
import { createMidiLangServices } from '../language/midi-lang-module.js';
import { extractDocument } from './cli-util.js';
import chalk from 'chalk';

export async function parseAndValidate(fileName: string): Promise<void> {
    // retrieve the services for our language
    const services = createMidiLangServices(NodeFileSystem).MidiLang;
    // extract a document for our program
    const document = await extractDocument(fileName, services);
    // extract the parse result details
    const parseResult = document.parseResult;
    // verify no lexer, parser, or general diagnostic errors show up
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${fileName} successfully!`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${fileName}!`));
    }
}