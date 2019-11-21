import { BChainableParser, BParser, BParserOptions } from './bParse';

export default class BObjectParser extends BChainableParser {

    public size: number;
    private fields: Array<[string, BParser]> = [];

    constructor(fields: { [key: string]: BParser }, protected options: BParserOptions) {
        super();
        this.fields = Object.entries(fields);
        this.size = this.fields.reduce((prev, parser) => prev + parser[1].size, 0);
    }

    parse(buf: Buffer, offset = 0) {
        const result = {} as any;
        for (const [key, parser] of this.fields) {
            result[key] = parser.parse(buf, offset);
            offset += parser.size;
        }
        return result;
    }
}