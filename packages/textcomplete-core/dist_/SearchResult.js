"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const MAIN = /\$&/g;
const PLACE = /\$(\d)/g;
class SearchResult {
    constructor(data, term, strategy) {
        this.data = data;
        this.term = term;
        this.strategy = strategy;
    }
    replace(beforeCursor, afterCursor) {
        let result = this.strategy.replace(this.data);
        if (result == null)
            return;
        if (Array.isArray(result)) {
            afterCursor = result[1] + afterCursor;
            result = result[0];
        }
        const match = this.strategy.match(beforeCursor);
        if (match == null || match.index == null)
            return;
        const replacement = result
            .replace(MAIN, match[0])
            .replace(PLACE, (_, p) => match[parseInt(p)]);
        return [
            [
                beforeCursor.slice(0, match.index),
                replacement,
                beforeCursor.slice(match.index + match[0].length),
            ].join(""),
            afterCursor,
        ];
    }
    render() {
        return this.strategy.renderTemplate(this.data, this.term);
    }
    getStrategyId() {
        return this.strategy.getId();
    }
}
exports.SearchResult = SearchResult;
//# sourceMappingURL=SearchResult.js.map