grammar MidiLang

hidden terminal WS: /\s+/;
terminal INT: /\d+/;
terminal NOTE_OCTAVE: /[A-G](##|bb|#|b)?[0-9]/;
terminal ID: /[_a-zA-Z][\w]*/;


entry Model: Music;

Music:
    'Music' name=ID_OR_INT (':')?
    (timeMeasures+=TimeMeasure+)
    (bpms+=Bpm+)
    (measures+=Measure+)
    (sequences+=Sequence+)
    (tracks+=Track+);

Bpm:
    'bpm' bpm=INT 'at' bpmMeasureTimes+=INT+;

TimeMeasure:
    'timeMeasure' timeMeasure=RATIONAL 'at' timeMeasureTimes+=INT+;

Measure:
    'Measure' name=ID_OR_INT ':'?
    (lines+=Line+);

Sequence:
    'Sequence' name=ID_OR_INT ':'?
    ('Measure' measureRefs+=[Measure] ('*' INT)?)+;

Track:
    'Track' name=ID_OR_INT 'instrument'? INSTRUMENT ':'?
    ('Sequence' sequenceRefs+=[Sequence])+;

Line:
    (notes+=Note ('|' notes+=Note)*);

Note:
    ((timeMeasure=INT ':')? noteOctave=NOTE_OCTAVE  ('at' position=RATIONAL)? ('for' duration=DURATION)?);

RATIONAL: numerator=INT '/' denominator=INT;

INSTRUMENT: value = 'DRUMS' | 'PIANO' | 'VIOLIN' | 'ALTO' | 'GUITAR' | 'HORN' | 
           'BASSOON' | 'CLARINET' | 'CORNAUSE' | 'CORNET' | 'TRUMPET' | 
           'FLUTE' | 'FRENCH_HORN' | 'TUBA' | 'UKULELE';

DURATION: value= INT | value=RATIONAL;

ID_OR_INT: value=ID | value=INT;
