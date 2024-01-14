grammar MidiLang

hidden terminal WS: /\s+/;
terminal NOTE_OCTAVE: /[A-G][0-9]/;
terminal ALTERATION: '##' | 'bb' | '#' | 'b';
terminal INT : /\d+/;

terminal ID: /[_a-zA-Z][\w]*/;

//hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
//hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry Model: (elements+=Element)*;

Element: Music;

Music:
    'Music' name=ID
    (timeMeasure+=TimeMeasure+)
    (bpms+=Bpm+)
    (tracks+=Track+);

Bpm:
    ('bpm' bpm=INT 'at' bpmMeasureTimes+=INT+);

TimeMeasure:
    ('timeMeasure' timeMeasure=Rational 'at' timeMeasureTimes+=INT+);

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
    ((timeMeasure=INT ':')? noteOctave=NOTE_OCTAVE (alteration=ALTERATION)?  ('at' position=Rational)? ('for' duration=Rational)?);

Rational:
    (numerator=INT '/' denominator=INT);


INSTRUMENT : value= 'DRUMS' | 'PIANO' | 'VIOLIN' | 'ALTO' | 'GUITAR' | 'HORN' | 
               'BASSOON' | 'CLARINET' | 'CORNAUSE' | 'CORNET' | 'TRUMPET' | 
               'FLUTE' | 'FRENCH_HORN' | 'TUBA' | 'UKULELE';
