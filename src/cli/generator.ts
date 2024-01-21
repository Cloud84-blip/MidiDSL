import { Model, Measure, Note, MidiTrack, Sequence } from '../language/generated/ast.js';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

import MidiWriter from 'midi-writer-js';

const initialBpm = 120;
const ticksPerBeat = 48;

// Définir un type pour les éléments de la timeline
interface TimelineElement {
    timeSignature?: number;
    bpm?: number;
}

// Déclarer la timeline avec ce type
let timeline: { [measureNumber: string]: TimelineElement } = {};
let currentBpm = initialBpm;
let currentBeatsPerMeasure = 4; // Signature rythmique initiale (ex. 4/4)

export function generateMidi(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.mid`;
    // Create a new track
    // Start with a new track
    const track = new MidiWriter.Track();
    track.setTimeSignature(4, 4, 24, 8); // Default time signature

    model.timeSignatures.forEach(ts => {
        ts.timeMeasureTimes.forEach(measureNumber => {
            const measureNumberString = measureNumber.toString();
            if (!timeline[measureNumberString]) timeline[measureNumberString] = {};
            // Convertir en number avant l'assignation
            timeline[measureNumberString].timeSignature = parseInt(ts.timeSignature.numerator);
        });
    });
    
    model.bpms.forEach(bpm => {
        bpm.bpmMeasureTimes.forEach(measureNumber => {
            const measureNumberString = measureNumber.toString();
            if (!timeline[measureNumberString]) timeline[measureNumberString] = {};
    
            // Convertir en number avant l'assignation
            timeline[measureNumberString].bpm = Number(bpm.bpm);
        });
    });
    
    // Propager l'état de la signature rythmique et du BPM
    let maxMeasure = Math.max(...Object.keys(timeline).map(Number));
    for (let i = 1; i <= maxMeasure; i++) {
        const measureNumberString = i.toString();
        if (!timeline[measureNumberString]) timeline[measureNumberString] = {};
        if (timeline[measureNumberString].timeSignature === undefined) timeline[measureNumberString].timeSignature = currentBeatsPerMeasure;
        else currentBeatsPerMeasure = timeline[measureNumberString].timeSignature ?? currentBeatsPerMeasure;
    
        if (timeline[measureNumberString].bpm === undefined) timeline[measureNumberString].bpm = currentBpm;
        else currentBpm = timeline[measureNumberString].bpm ?? currentBpm;
    }
    // Générer les événements MIDI
    Object.keys(timeline).forEach(measureNumber => {
        let measureInfo = timeline[measureNumber];
        let tick = calculateTick(Number(measureNumber), measureInfo.timeSignature ?? 4, ticksPerBeat);

        //track.addEvent(new TempoEvent({ bpm: measureInfo.bpm ?? 120, tick: tick }));
        track.setTempo(measureInfo.bpm ?? 120, tick);
        // Générer un événement de changement de signature rythmique si nécessaire
    });

    // Handle each track in the model
    model.tracks.forEach(t => {
        handleTrack(t, track);
    });

    // Write the MIDI file
    let write = new MidiWriter.Writer(track);
    fs.writeFileSync(generatedFilePath, write.buildFile());

    return generatedFilePath;
}

/**
 * Calcule le tick pour un changement de BPM à une mesure spécifique.
 * 
 * @param {number} measureNumber - Le numéro de la mesure où le changement de BPM doit se produire.
 * @param {number} beatsPerMeasure - Le nombre de battements par mesure (dépend de la signature rythmique).
 * @param {number} ticksPerBeat - Le nombre de ticks par battement (dépend de la résolution MIDI).
 * @returns {number} Le tick à laquelle le changement de BPM doit être appliqué.
 */
function calculateTick(measureNumber : number, beatsPerMeasure : number, ticksPerBeat : number) {
    // Calculer le nombre total de battements jusqu'à la mesure spécifiée
    let totalBeats = (measureNumber - 1) * beatsPerMeasure;

    // Calculer et retourner le nombre total de ticks
    return totalBeats * ticksPerBeat;
}

function handleTrack(trackModel: MidiTrack, track: any) {
    // You'll need to handle the instrument change and sequence of measures here
    // For now, we'll assume a default instrument and add notes directly

    trackModel.sequenceRefs.forEach((sequence : Sequence | any) => {
        handleSequence(sequence.$ref, track);
    });
}

function handleSequence(sequence: Sequence, track: any) {
    sequence.measureRefs.forEach((measureRef : Measure | any) => {
        handleMeasure(measureRef.$ref, track);
    });
}

function handleMeasure(measure: Measure, track: any) {
    measure.lines.forEach(line => {
        line.notes.forEach(note => {
            handleNote(note, track);
        });
    });
}

function handleNote(note: Note, track: any) {
    let tick;
    if(note.timeMeasure === undefined){
        tick = 0; //need to define the right one
    } else{
        let timeMeasure = Number(note.timeMeasure);
        tick = calculateTick(timeMeasure, currentBeatsPerMeasure, ticksPerBeat);
    }
    let midiNote = new MidiWriter.NoteEvent({ startTick : tick, pitch: [note.noteOctave], duration: note.duration?.value });
    track.addEvent(midiNote);
}


//model.measures.forEach(measure => generateMeasure(measure, fileNode));
/*
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
    //parentNode.append(`playNote('${note.id}', ${rationalToString(note.position)}, ${rationalToString(note.duration)});`);
}

//function rationalToString(rational: Rational): string {
//    return `${rational.numerator}/${rational.denominator}`;
//}
*/
