const {
    Re,
    Any, EmptyStr, Or, ZeroOrMore
} = require('../index')

test('zeroOrMore: repeat words twice times ',
    () => expect(new Re(ZeroOrMore('abc')).match('abcabc')).toBe(true)
)
test('zeroOrMore: repeat zero times with the character tail',
    () => expect(new Re([ZeroOrMore("abc"), "d"]).match("d")).toBe(true)
)

test('Or & Array: success case',
    () => expect(new Re(["a", Or(["a", "b"]), "d"]).match("abd")).toBe(true)
)

test('Or & Array: failure case',
    () => expect(new Re(["a", Or(["a", "b"]), "d"]).match("aed")).toBe(false)
)

test('Any: success case',
    () => expect(new Re(["a",Any, "d"]).match("aed")).toBe(false)
)

test('Any: failure case',
    () => expect(new Re(["a",Any, "d"]).match("ad")).toBe(false)
)



describe('phone number:',
    ()=>{
        const Digit = Or(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
        const usPhoneNumber = new Re([Or([['(', Digit, Digit, Digit, ') '], '']), Digit, Digit, Digit, '-', Digit, Digit, Digit, Digit]);

        test('with Parentheses:',
            () => expect(usPhoneNumber.match('(415) 555-1212')).toBe(true)
        )

        test('without Parentheses:',
            () => expect(usPhoneNumber.match('555-1212')).toBe(true)
        )

        test('failure case:',
            () => expect(usPhoneNumber.match('squirrel')).toBe(false)
        )
    }
)