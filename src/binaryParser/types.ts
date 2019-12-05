export enum Endianness {
  LittleEndian,
  BigEndian
}

export interface BParserOptions {
  endianness: Endianness;
}

export interface BParser {
  /** Size in bytes */
  size: number;
  parse(buf: Buffer, offset?: number): any;
}
