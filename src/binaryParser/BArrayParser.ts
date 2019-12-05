import { BParser, BParserOptions } from './types';

export default class BArrayParser implements BParser {

    public size: number;
    private itemParsers: Array<BParser> = [];

    constructor(items: Array<BParser>, protected options: BParserOptions) {
        this.itemParsers = items;
        this.size = this.itemParsers.reduce((prev, parser) => prev + parser.size, 0);
    }

    parse(buf: Buffer, offset = 0) {
        const result = Array(this.itemParsers.length);
        for (const parser of this.itemParsers) {
            result.push(parser.parse(buf, offset));
            offset += parser.size;
        }
        return result;
    }
}