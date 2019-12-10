import { Parser } from './types';

export default class ArrayParser extends Parser {

    public size: number;
    private parser: Parser;
    private length: number;

    constructor(parser: Parser, length: number) {
        super();
        this.length = length;
        this.parser = parser;
        this.size = parser.size * length;
    }

    parse(buf: Buffer, offset = 0) {
        const result = Array(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this.parser.parse(buf, offset);
            offset += this.parser.size;
        }
        return result;
    }

}
