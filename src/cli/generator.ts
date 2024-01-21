import { Model, MidiTrack} from '../language/generated/ast.js';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

function handleTrack(trackModel: MidiTrack, jsonOutput: any) {
    let trackData : { sequences: any[]} = {
        sequences: []
    };
    
    

    trackModel.sequenceRefs.forEach(sequenceRef => {
        console.log(sequenceRef.ref);
    });

    trackModel.sequenceRefs.forEach(sequenceRef => {
        const sequence = sequenceRef.ref; // Suivre la référence
        let sequenceData: { measures: any[] } = {
            measures: []
        };
        if (!sequence){
            return;
        }
        sequence.measureRefs.forEach(measureRef => {
            const measure = measureRef.ref; // Suivre la référence
            // let measureData = {
            //     lines: []
            // };
            if (!measure){
                console.log("measure is undefined");
                return;
            }
            measure.lines.forEach(line => {
                let measureData: { lines: any[] } = {
                    lines: []
                }; // Initialize measureData as an object with a lines property that is an array
                let lineData = {
                    notes: line.notes.map(note => {
                        return {
                            noteOctave: note.noteOctave,
                            position: note.position,
                            duration: note.duration?.value
                        };
                    })
                };
                measureData.lines = []; // Initialize lines as an empty array
                measureData.lines.push(lineData);
                sequenceData.measures.push(measureData);
            });
        });
        trackData.sequences.push(sequenceData);
    });

    jsonOutput.tracks.push(trackData);
}

export function generateJson(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.json`;

    let jsonOutput = {
        tracks: []
    };

    model.tracks.forEach(trackModel => {
        handleTrack(trackModel, jsonOutput);
    });

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, JSON.stringify(jsonOutput, null, 2));

    return generatedFilePath;
}
