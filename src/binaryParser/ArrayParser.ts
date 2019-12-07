import { Parser } from './types';

export default class ArrayParser extends Parser {

    public size: number;
    private itemParsers: Array<Parser> = [];

    constructor(items: Array<Parser>) {
        super()
                this.itemParsers = items
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
