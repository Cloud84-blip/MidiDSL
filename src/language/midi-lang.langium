grammar MidiLang

hidden terminal WS: /\s+/;
terminal NOTE_OCTAVE: /[A-G](##|bb|#|b)?[0-9]/;

terminal ID_OR_INT: /[a-zA-Z0-9]+/;


entry Model: Music;

Music:
    'Music' name=ID_OR_INT (':')?
    (timeSignatures+=TimeSignature+)
    (bpms+=Bpm+)
    (measures+=Measure+)
    (sequences+=Sequence+)
    (tracks+=MidiTrack+);

Bpm:
    'bpm' bpm=ID_OR_INT ('at' bpmMeasureTimes+=ID_OR_INT+)?;

TimeSignature:
    'timeSignature' timeSignature=RATIONAL ('at' timeMeasureTimes+=ID_OR_INT+)?;

Measure:
    'Measure' name=ID_OR_INT ':'?
    (lines+=Line+);

Sequence:
    'Sequence' name=ID_OR_INT ':'?
    ('Measure' measureRefs+=[Measure:ID_OR_INT] ('*' iterationsRefs+=ITERATION)?)+;

MidiTrack:
    'Track' name=ID_OR_INT 'instrument'? INSTRUMENT ':'?
    (('Sequence')? sequenceRefs+=[Sequence:ID_OR_INT])+;

Line:
    (notes+=Note ('|' notes+=Note)*);

Note:
    ((timeMeasure=ID_OR_INT ':')? noteOctave=NOTE_OCTAVE  ('at' position=RATIONAL)? ('for' numerator=ID_OR_INT '/' denominator=ID_OR_INT)?);

RATIONAL: numerator=ID_OR_INT '/' denominator=ID_OR_INT;

INSTRUMENT: value = 'DRUMS' | 'PIANO' | 'VIOLIN' | 'ALTO' | 'GUITAR' | 'HORN' | 
           'BASSOON' | 'CLARINET' | 'CORNAUSE' | 'CORNET' | 'TRUMPET' | 
           'FLUTE' | 'FRENCH_HORN' | 'TUBA' | 'UKULELE';

ITERATION: value= ID_OR_INT;