import { Model, Measure, Note, MidiTrack, Sequence } from '../language/generated/ast.js';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

import MidiWriter from 'midi-writer-js';
import { Reference } from 'langium';

const initialBpm = 120;
const ticksPerBeat = 48;
const tracks: any[] = [];

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

    // Set up a track list with a list of new Midi.Track objects
    model.tracks.forEach(t => {
        tracks.push(new MidiWriter.Track());
    });

    const timeSignature = model.timeSignatures[0].timeSignature; // for simplicity, we assume there is only one time signature in the generator for now
    tracks.forEach(track => {
        track.setTimeSignature(parseInt(timeSignature.numerator), parseInt(timeSignature.denominator), 24, 8);
    });
    
    
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
        tracks.forEach(track => {
            track.setTempo(measureInfo.bpm ?? 120, tick);
        });
        // Générer un événement de changement de signature rythmique si nécessaire
    });

    // Handle each track in the model
    model.tracks.forEach((t,index) => {
        handleTrack(t, tracks[index]);
    });

    // Write the MIDI file
    const write = new MidiWriter.Writer(tracks);

    // Génération et écriture du fichier MIDI
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
    trackModel.sequenceRefs.forEach(sequence => {
        handleSequence(sequence, track);
    });
}

function handleSequence(sequence: Reference<Sequence>, track: any) {
    let numberOfIterations;
    sequence.ref?.measureRefs.forEach((measure, index) => {
        if(sequence.ref?.iterationsRefs[index] === undefined) numberOfIterations = 1;
        else numberOfIterations = Number(sequence.ref?.iterationsRefs[index].value);
        if (isNaN(numberOfIterations)) numberOfIterations = 1;
        console.log(measure.ref?.name);
        handleMeasure(measure, track,numberOfIterations);
    });
}

function handleMeasure(measure: Reference<Measure>, track: any,numberOfIterations : number) {
    for (let i = 0; i < numberOfIterations; i++) {
        measure.ref?.lines.forEach(line => {
            line.notes.forEach(note => {
                handleNote(note, track);
            });
        });
    }
}

function handleNote(note: Note, track: any) {
    let tick;
    if(note.timeMeasure === undefined){
        tick = 0; //DUNNO if this is correct
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
