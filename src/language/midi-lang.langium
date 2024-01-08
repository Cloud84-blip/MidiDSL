grammar MidiLang

entry Model:
    Music;

Music:
    'Music' name=ID
    timeMesure+=TimeMesure+
    bpms+=Bpm+
    tracks+=Track+;

Bpm:
    'bpm' bpm=INT 'at' bpmMeasureTimes+=INT+;

TimeMesure:
    'timeMesure' TimeMesure=Rational 'at' TimeMeasureTimes+=INT+;

Track:
    'Track' name=ID 'instrument' INSTRUMENT
    enchainements+= Enchainement+ ;

Enchainement:
    'Enchainement' name=ID ':' 
    measures+=Measure+ ('*' INT)?;

Measure:
    'Mesure' number=INT
    lines+=Line+;

Line:
    notes+=Note ('|' notes+=Note)*;

Note:
    (timeMesure=INT ':')? element=NOTE OCTAVE (ALTERATION)?  ('at' position=Rational)? ('for' duration=Rational)?;

Rational:
    numerator=INT '/' denominator=INT;

hidden terminal WS: /\s+/;
terminal NOTE: /[A-G]/;
terminal OCTAVE: /[1-8]/;
terminal ALTERATION: '##' | 'bb' | '#' | 'b';
terminal INT returns number: /[0-9]+/;

terminal ID: /[_a-zA-Z][\w]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

terminal INSTRUMENT : 'DRUMS' | 'PIANO' | 'VIOLIN' | 'ALTO' | 'GUITAR' | 'HORN' | 
               'BASSOON' | 'CLARINET' | 'CORNAUSE' | 'CORNET' | 'TRUMPET' | 
               'FLUTE' | 'FRENCH_HORN' | 'TUBA' | 'UKULELE';
