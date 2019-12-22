import { Parser } from './types';

export interface StringParserOptions {
    encoding?: string;
    trim?: boolean;
};

export default class StringParser extends Parser {

    size = -1;
    private _encoding?: string;

    parse(buf: Buffer, offset = 0): string {
        const encoding = this._encoding || this.options.stringEncoding;
        if (this.size === -1)
            throw new Error('Variable size String not implemented');

        let s = buf.toString(encoding || 'utf8', offset, offset + this.size);
        if (s.includes('\0'))
            s = s.substring(0, s.indexOf('\0'));
        return s;
    }

    length(bytes: number): this {
        this.size = bytes;
        return this;
    }

    encoding(s: string): this {
        this._encoding = s;
        return this;
    }

}
