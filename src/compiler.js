const R = require('ramda')

const {EmptyStr, AnyCharacterNode, CharacterNode, AlternativeNode, RepetitionNode} = require('./nodes')

function Or(alternatives) {
    if (this.constructor !== Or) return new Or(alternatives)
    this.alternatives = alternatives
}

function ZeroOrMore(repeatable) {
    if (this.constructor !== ZeroOrMore) return new ZeroOrMore(repeatable)
    this.repeatable = repeatable
}

const Any = Symbol('Any')

const compileStr = (str, tail = EmptyStr) => R.reduce(
    (tail, char) => new CharacterNode(char, tail),
    tail,
    R.reverse(str)
)

const compileArray = (exprList, tail = EmptyStr) => R.reduce(
    (tail, expr) => compile(expr, tail),
    tail,
    R.reverse(exprList)
)

const compileOr = (or, tail = EmptyStr) => new AlternativeNode(or.alternatives.map(alt => compile(alt, tail)))

const compileZeroOrMore = (zeroOrMore, tail = EmptyStr) => {
    const repetitionNode = new RepetitionNode(tail)
    repetitionNode.head = compile(zeroOrMore.repeatable, repetitionNode)
    return repetitionNode
}

const compileAny = (tail = EmptyStr) => new AnyCharacterNode(tail)

function compile(expr, tail = EmptyStr) {
    if (Any) return compileAny(tail)

    switch (expr.constructor) {
        case String:
            return compileStr(expr, tail)
        case Array:
            return compileArray(expr, tail)
        case Or:
            return compileOr(expr, tail)
        case ZeroOrMore:
            return compileZeroOrMore(expr, tail)
        default:
            throw new Error(`invalid expr:${expr}`)
    }
}

module.exports = {compile, Any, EmptyStr, Or, ZeroOrMore}

