import { DefaultOptions } from './options';

export enum Endianness {
  LittleEndian,
  BigEndian
}

const defaultOptions: DefaultOptions = {
  endianness: Endianness.LittleEndian,
  stringEncoding: 'utf8',
  trimStrings: true,
}

export abstract class Parser {
  /** Size in bytes */
  abstract size: number;
  abstract parse(buf: Buffer, offset?: number): any;
  protected options = defaultOptions;

  defaultOptions(options: Partial<DefaultOptions>) {
    Object.assign(this.options, options);
    return this;
  }

}

export abstract class NumberParser extends Parser {

  protected endianness?: Endianness;

  littleEndian() {
    this.endianness = Endianness.LittleEndian;
    return this;
  }

  bigEndian() {
    this.endianness = Endianness.BigEndian;
    return this;
  }

}
