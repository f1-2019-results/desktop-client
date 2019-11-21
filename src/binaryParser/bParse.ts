import BObjectParser from './BObjectParser';
import BArrayParser from './BArrayParser';
import * as valueParsers from './valueParsers';

export enum Endianness {
    LittleEndian,
    BigEndian,
}

export interface BParserOptions {
    endianness: Endianness,
}

export interface BParser {
    /** Size in bytes */
    size: number;
    parse(buf: Buffer, offset?: number): any
}

export abstract class BChainableParser implements BParser {

    protected abstract options: BParserOptions;

    object(fields: { [key: string]: BParser }, options?: BParserOptions) {
        const scopedOptions = this.options;
        if (options)
            Object.assign(scopedOptions, options);
        return new BObjectParser(fields, this.getScopedOptions(options));
    }

    array(items: Array<BParser>, options?: BParserOptions) {
        return new BArrayParser(items, this.getScopedOptions(options));
    }

    int8(options?: BParserOptions) {
        return new valueParsers.Int8Parser(this.getScopedOptions(options));
    }

    int16(options?: BParserOptions) {
        return new valueParsers.Int16Parser(this.getScopedOptions(options));
    }

    uint16(options?: BParserOptions) {
        return new valueParsers.Uint16Parser(this.getScopedOptions(options));
    }

    int32(options?: BParserOptions) {
        return new valueParsers.Int32Parser(this.getScopedOptions(options));
    }

    uint32(options?: BParserOptions) {
        return new valueParsers.Uint32Parser(this.getScopedOptions(options));
    }

    int64(options?: BParserOptions) {
        return new valueParsers.Int64Parser(this.getScopedOptions(options));
    }

    uint64(options?: BParserOptions) {
        return new valueParsers.Uint64Parser(this.getScopedOptions(options));
    }

    /**
     * @param size Size in bytes
     * @param options 
     */
    string(size: number, options?: valueParsers.StringParserOptions) {
        return new valueParsers.StringParser(size, this.getScopedOptions(options));
    }

    private getScopedOptions(options?: BParserOptions) {
        const scopedOptions = this.options;
        if (options)
            Object.assign(scopedOptions, options);
        return scopedOptions;
    }

    abstract size: number;
    abstract parse(buf: Buffer, offset?: number): any;

}
