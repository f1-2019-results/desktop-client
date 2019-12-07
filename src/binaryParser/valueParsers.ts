import { NumberParser, Endianness, Parser } from './types';

export class Int8Parser extends Parser {
    size = 1;

    parse(buf: Buffer, offset = 0) {
        return buf.readInt8(offset);
    }
}

export class Uint8Parser extends Parser {
    size = 1;

    parse(buf: Buffer, offset = 0) {
        return buf.readUInt8(offset);
    }
}

export class Int16Parser extends NumberParser {
    size = 2;

    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readInt16LE(offset);
        return buf.readInt16BE(offset);
    }
}

export class Uint16Parser extends NumberParser {
    size = 2;

    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readUInt16LE(offset);
        return buf.readUInt16BE(offset);
    }
}

export class Int32Parser extends NumberParser {
    size = 4;

    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readInt32LE(offset);
        return buf.readInt32BE(offset);
    }
}

export class Uint32Parser extends NumberParser {
    size = 4;

    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readUInt32LE(offset);
        return buf.readUInt32BE(offset);
    }
}

export class Int64Parser extends NumberParser {
    size = 8;

    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readBigInt64LE(offset);
        return buf.readBigInt64BE(offset);
    }
}

export class Uint64Parser extends NumberParser {
    size = 8;

    parse(buf: Buffer, offset = 0) {
        const endianness = this.endianness
        if (this.endianness === Endianness.LittleEndian)
            return buf.readBigUInt64LE(offset);
        return buf.readBigUInt64BE(offset);
    }
}

export interface StringParserOptions {
    encoding?: string;
    trim?: boolean;
}

export class StringParser extends Parser {

    size = -1;
    private _encoding?: string;

    parse(buf: Buffer, offset = 0) {
        const encoding = this._encoding || this.options.stringEncoding;
        if (this.size === -1)
            throw new Error('Variable size String not implemented');

        let s = buf.toString(encoding || 'utf8', offset, offset + this.size);
        s = s.substring(0, s.indexOf('\0'));
        return s;
    }

    length(bytes: number) {
        this.size = bytes;
        return this;
    }

    encoding(s: string) {
        this._encoding = s;
    }

}
