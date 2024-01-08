import type { Model, Measure, Line, Note, Rational } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const { fileName, destinationPath } = extractDestinationAndName(filePath, destination, '.js');
    
    // Créer le nœud générateur
    const fileNode = new CompositeGeneratorNode();
    
    // Parcourir le modèle et générer du code JavaScript
    model.measures.forEach(measure => generateMeasure(measure, fileNode));

    // Écrire le résultat dans un fichier
    const content = toString(fileNode);
    const outputPath = path.join(destinationPath, fileName);
    fs.writeFileSync(outputPath, content);
    return outputPath;
}

function generateMeasure(measure: Measure, parentNode: CompositeGeneratorNode): void {
    parentNode.append(`// Mesure ${measure.number}`, NL);
    measure.lines.forEach(line => {
        generateLine(line, parentNode);
        parentNode.append(NL);
    });
}

function generateLine(line: Line, parentNode: CompositeGeneratorNode): void {
    line.notes.forEach((note, index) => {
        if (index > 0) {
            parentNode.append(' | ');
        }
        generateNote(note, parentNode);
    });
}

function generateNote(note: Note, parentNode: CompositeGeneratorNode): void {
    parentNode.append(`playNote('${note.id}', ${rationalToString(note.position)}, ${rationalToString(note.duration)});`);
}

function rationalToString(rational: Rational): string {
    return `${rational.numerator}/${rational.denominator}`;
}


