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
        const result = Array(this.length) as Array<ReturnType<T['parse']>>;
        for (let i = 0; i < this.length; i++) {
            result[i] = this.parser.parse(buf, offset) as ReturnType<T['parse']>;
            offset += this.parser.size;
        }
        return result;
    }

}
