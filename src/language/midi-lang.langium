grammar MidiLang

entry Model:
    measures+=Measure*;

Measure:
    'Mesure' number=INT ':' lines+=Line+;

Line:
    notes+=Note ('|' notes+=Note)*;

Note:
    id=ID ':' 'at' position=Rational 'for' duration=Rational;

Rational:
    numerator=INT '/' denominator=INT;

hidden terminal WS: /\s+/;
terminal ID: /[A-Z][1-9][#b]?/;
terminal INT returns number: /[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
