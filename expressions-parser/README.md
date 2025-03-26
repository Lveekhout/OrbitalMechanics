### URL
https://jacquev6.github.io/DrawGrammar/

### Voorbeeld
expr = term, whitespace, { ( '+' | '-' ) , whitespace, term, whitespace, };

term = { factor, whitespace, ( '*' | '/' ), whitespace }, factor, whitespace;

factor = (integer | '(', whitespace, expr, whitespace, ')'), whitespace;

integer = [ '-', whitespace ], digit, { digit }, whitespace;

digit = '0' | '1' | '...' | '9';

whitespace = {'space'|'tab'|'linefeed'|'carriage return'};


### Alternatief MET unary minus
(* Updated mathematical expression parser syntax with unary minus *)

expression = [ '-' ], term, { ('+' | '-'), term };

term = factor, { ('*' | '/'), factor };

factor = power, { '^', power };

power = '(', expression, ')' | constante | number | variable | function;

function = ('sin' | 'cos' | 'tan' | 'ln' ), '(', expression, ')';

constante = 'e' | 'pi';

number = ['-'], digit, { digit }, [ '.', digit, { digit } ];

variable = 'a' | '...' | 'z';

digit = '0' | '...' | '9';

whitespace = {"' '"|'\t'|'\n'|'\r'};
