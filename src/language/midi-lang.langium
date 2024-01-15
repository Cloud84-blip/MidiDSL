grammar MidiLang

hidden terminal WS: /\s+/;
terminal NOTE_OCTAVE: /[A-G][0-9]/;
terminal ID: /[_a-zA-Z][\w]*/;
terminal INT : /\d+/;


//hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
//hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry Model: Music;

Music:
    'Music' name=ID
    (timeMeasure+=TimeMeasure+)
    (bpms+=Bpm+)
    (tracks+=Track+);

Bpm:
    ('bpm' bpm=INT 'at' bpmMeasureTimes+=INT+);

TimeMeasure:
    ('timeMeasure' timeMeasure=RATIONAL 'at' timeMeasureTimes+=INT+);

Track:
    ('Track' name=ID 'instrument' INSTRUMENT)
    (enchainements+= Enchainement+);

Enchainement:
    ('Enchainement' name=ID ':') 
    (measures+=Measure+ ('*' INT)?);

Measure:
    ('Measure' number=INT)
    (lines+=Line+);

Line:
    (notes+=Note ('|' notes+=Note)*);

Note:
    ((timeMeasure=INT ':')? noteOctave=NOTE_OCTAVE alteration=ALTERATION?  ('at' position=RATIONAL)? ('for' duration=DURATION)?);


RATIONAL: (numerator=INT '/' denominator=INT);


INSTRUMENT : value= 'DRUMS' | 'PIANO' | 'VIOLIN' | 'ALTO' | 'GUITAR' | 'HORN' | 
               'BASSOON' | 'CLARINET' | 'CORNAUSE' | 'CORNET' | 'TRUMPET' | 
               'FLUTE' | 'FRENCH_HORN' | 'TUBA' | 'UKULELE';

ALTERATION: value = '##' | 'bb' | '#' | 'b';

DURATION: value = INT | value=RATIONAL;
