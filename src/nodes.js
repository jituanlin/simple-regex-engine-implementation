class ReNode {
    derive() {
        return NeverMatches
    }
    get matchEnd() {
        return false
    }
    get canMatchMore() {
        return !this.matchEnd
    }
}

const NeverMatches = new ReNode

class _EmptyStr extends ReNode {
    get matchEnd() {
        return true
    }
}
const EmptyStr = new _EmptyStr

class CharacterNode extends ReNode {
    constructor(char, next) {
        super()
        this.next = next
        this.char = char
    }

    derive(char) {
        if (this.char === char) return this.next
        return NeverMatches
    }
}

class AnyCharacterNode extends ReNode {
    constructor(next) {
        super()
        this.next = next
    }
    derive(char) {
        return this.next
    }
}

class AlternativeNode {
    constructor(alternatives) {
        alternatives = alternatives.filter(alt => alt !== NeverMatches)
        switch (alternatives.length) {
            case 0: return NeverMatches
            case 1: return alternatives[0]
            default:
                this.alternatives = alternatives
                return this
        }
    }

    derive(char) {
        return new AlternativeNode(
            this.alternatives.map(alt => alt.derive(char))
        )
    }

    get matchEnd() {
        return this.alternatives.some(alt => alt.matchEnd)
    }

    get canMatchMore() {
        return this.alternatives.some(alt => alt.canMatchMore)
    }
}

class RepetitionNode extends ReNode {
    constructor(next) {
        super()
        this.next = next
        this.head = NeverMatches
    }

    derive(char) {
        return new AlternativeNode([
            this.head.derive(char),
            this.next.derive(char)
        ])
    }

    get canMatchMore() { return true }

    get matchEnd() { return this.next.matchEnd }
}



module.exports = { EmptyStr, CharacterNode, AnyCharacterNode, AlternativeNode, RepetitionNode }