const {compile} = require('./compiler')

class Re {
    constructor(regex) {
        this.state = compile(regex)
    }

    match(str) {
        if (str.length === 0 && this.state.matchEnd) return true
        let state = this.state
        for (let index = 0; index < str.length; index++) {
            const char = str[index]
            state = state.derive(char)

            if (state.matchEnd && index === str.length - 1) return true
            if (state.matchEnd && !state.canMatchMore) return false
        }

        return false
    }

}


module.exports = Re
