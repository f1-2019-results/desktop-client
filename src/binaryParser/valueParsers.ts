import { BParser, Endianness, BParserOptions } from './bParse';

export class Int8Parser implements BParser {
    size = 1;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        return buf.readInt8(offset);
    }
}

export class Uint8Parser implements BParser {
    size = 1;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        return buf.readUInt8(offset);
    }
}

export class Int16Parser implements BParser {
    size = 2;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readInt16LE(offset);
        return buf.readInt16BE(offset);
    }
}

export class Uint16Parser implements BParser {
    size = 2;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readUInt16LE(offset);
        return buf.readUInt16BE(offset);
    }
}

export class Int32Parser implements BParser {
    size = 4;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readInt32LE(offset);
        return buf.readInt32BE(offset);
    }
}

export class Uint32Parser implements BParser {
    size = 4;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readUInt32LE(offset);
        return buf.readUInt32BE(offset);
    }
}

export class Int64Parser implements BParser {
    size = 8;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readBigInt64LE(offset);
        return buf.readBigInt64BE(offset);
    }
}

export class Uint64Parser implements BParser {
    size = 8;
    constructor(protected options: BParserOptions) { }
    parse(buf: Buffer, offset = 0) {
        if (this.options.endianness === Endianness.LittleEndian)
            return buf.readBigUInt64LE(offset);
        return buf.readBigUInt64BE(offset);
    }
}

export interface StringParserOptions extends BParserOptions {
    encoding?: string;
    trim?: boolean;
}

export class StringParser implements BParser {
    constructor(
        public size: number,
        protected options: StringParserOptions
    ) { }
    parse(buf: Buffer, offset = 0) {
        let s = buf.toString(this.options.encoding || 'utf8', offset, offset + this.size);
        if (this.options.trim)
            s = s.replace(/\0/g, '').trim();
        return s;
    }
}
