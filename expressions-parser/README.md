### URL
* https://jacquev6.github.io/DrawGrammar/
* https://mdkrajnak.github.io/ebnftest/

### Voorbeeld EBNF
```
expression = term, { ('+' | '-'), term };

term = ['-'], factor, { [ '*' | '/' ], factor };

factor = power, {'^', ['-'], power};

power = '(', expression, ')' | constant | number | variable | function;

function = ('sin' | 'cos' | 'tan' | 'ln' | 'sqrt'), '(', expression, ')';

constant = 'e' | 'pi' | 'i';

number = digit, { digit }, [ '.', digit, { digit } ];

variable = 'a' | 'b' | 'c' | 'n' | 'r' | 'x' | 'y' | 'z';

digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
```
