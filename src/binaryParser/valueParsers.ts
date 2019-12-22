import { NumberParser, Endianness, Parser } from './types';

export class Int8Parser extends NumberParser {
    size = 1;

    parse(buf: Buffer, offset = 0): number {
        return buf.readInt8(offset);
    }
}

export class Uint8Parser extends NumberParser {
    size = 1;

    parse(buf: Buffer, offset = 0): number {
        return buf.readUInt8(offset);
    }
}

export class Int16Parser extends NumberParser {
    size = 2;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readInt16LE(offset);
        return buf.readInt16BE(offset);
    }
}

export class Uint16Parser extends NumberParser {
    size = 2;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readUInt16LE(offset);
        return buf.readUInt16BE(offset);
    }
}

export class Int32Parser extends NumberParser {
    size = 4;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readInt32LE(offset);
        return buf.readInt32BE(offset);
    }
}

export class Uint32Parser extends NumberParser {
    size = 4;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readUInt32LE(offset);
        return buf.readUInt32BE(offset);
    }
}

export class Int64Parser extends NumberParser {
    size = 8;

    parse(buf: Buffer, offset = 0): bigint {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readBigInt64LE(offset);
        return buf.readBigInt64BE(offset);
    }
}

export class Uint64Parser extends NumberParser {
    size = 8;

    parse(buf: Buffer, offset = 0): bigint {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readBigUInt64LE(offset);
        return buf.readBigUInt64BE(offset);
    }
}

export class FloatParser extends NumberParser {
    size = 4;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readFloatLE(offset);
        return buf.readFloatBE(offset);
    }
}

export class DoubleParser extends NumberParser {
    size = 8;

    parse(buf: Buffer, offset = 0): number {
        if (this.endianness === Endianness.LittleEndian)
            return buf.readDoubleLE(offset);
        return buf.readDoubleBE(offset);
    }
}

export class BooleanParser extends NumberParser {
    size = 1;

    parse(buf: Buffer, offset = 0): boolean {
        return buf.readUInt8(offset) !== 0;
    }
}
