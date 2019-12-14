import { Parser } from './types';

export default class ArrayParser<T extends Parser> extends Parser {

    public size: number;
    private parser: T;
    private length: number;

    constructor(parser: T, length: number) {
        super();
        this.length = length;
        this.parser = parser;
        this.size = parser.size * length;
    }

    parse(buf: Buffer, offset = 0): Array<ReturnType<T['parse']>> {
        const result = Array(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this.parser.parse(buf, offset);
            offset += this.parser.size;
        }
        return result;
    }

}
