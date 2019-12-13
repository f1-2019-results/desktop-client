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

  protected _endianness?: Endianness;

  public get endianness() {
    return this._endianness != null ? this._endianness : this.options.endianness;
  }

  littleEndian() {
    this._endianness = Endianness.LittleEndian;
    return this;
  }

  bigEndian() {
    this._endianness = Endianness.BigEndian;
    return this;
  }

}
