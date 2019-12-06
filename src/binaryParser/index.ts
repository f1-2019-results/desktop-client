import BArrayParser from "./BArrayParser";
import BObjectParser from "./BObjectParser";
import * as parsers from "./valueParsers";
import { BParser, BParserOptions, Endianness } from "./types";

function object(
  fields: { [key: string]: BParser },
  options: BParserOptions = { endianness: Endianness.LittleEndian }
) {
  return new BObjectParser(fields, options);
}

function array(
  items: Array<BParser>,
  options: BParserOptions = { endianness: Endianness.LittleEndian }
) {
  return new BArrayParser(items, options);
}

export default {
  object,
  array,
  int8: (...args: ConstructorParameters<typeof parsers.Int8Parser>) => new parsers.Int8Parser(...args),
  uint8: (...args: ConstructorParameters<typeof parsers.Uint8Parser>) => new parsers.Uint8Parser(...args),
  int16: (...args: ConstructorParameters<typeof parsers.Int16Parser>) => new parsers.Int16Parser(...args),
  uint16: (...args: ConstructorParameters<typeof parsers.Uint16Parser>) => new parsers.Uint16Parser(...args),
  int32: (...args: ConstructorParameters<typeof parsers.Int32Parser>) => new parsers.Int32Parser(...args),
  uint32: (...args: ConstructorParameters<typeof parsers.Uint32Parser>) => new parsers.Uint32Parser(...args),
  int64: (...args: ConstructorParameters<typeof parsers.Int64Parser>) => new parsers.Int64Parser(...args),
  uint64: (...args: ConstructorParameters<typeof parsers.Uint64Parser>) => new parsers.Uint64Parser(...args),
  string: (...args: ConstructorParameters<typeof parsers.StringParser>) => new parsers.StringParser(...args)
};
