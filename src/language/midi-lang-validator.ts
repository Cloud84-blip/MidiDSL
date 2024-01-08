import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { MidiLangAstType, Measure, Line, Note, Rational } from './generated/ast.js';
import type { MidiLangServices } from './midi-lang-module.js';

export function registerValidationChecks(services: MidiLangServices): void {
    const registry = services.validation.ValidationRegistry;
    const validator = new MidiLangValidator();
    const checks: ValidationChecks<MidiLangAstType> = {
        Measure: validator.checkMeasure,
        Line: validator.checkLine,
        Note: validator.checkNote,
        Rational: validator.checkRational
    };
    registry.register(checks, validator);
}

export class MidiLangValidator {
    checkMeasure(measure: Measure, accept: ValidationAcceptor): void {
        // Exemple de validation : vérifier si le numéro de mesure est positif
        if (measure.number <= 0) {
            accept('error', 'Le numéro de mesure doit être positif', { node: measure, property: 'number' });
        }
    }

    checkLine(line: Line, accept: ValidationAcceptor): void {
        // Exemple de validation pour Line
    }

    checkNote(note: Note, accept: ValidationAcceptor): void {
        // Exemple de validation : vérifier la validité de la durée de la note
        if (note.duration.numerator <= 0 || note.duration.denominator <= 0) {
            accept('error', 'La durée de la note doit être positive', { node: note, property: 'duration' });
        }
    }

    checkRational(rational: Rational, accept: ValidationAcceptor): void {
        // Exemple de validation pour Rational
        if (rational.denominator === 0) {
            accept('error', 'Le dénominateur ne peut pas être zéro', { node: rational, property: 'denominator' });
        }
    }
}
