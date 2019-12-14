import * as parsers from "./valueParsers";
import ObjectParser from "./ObjectParser";
import ArrayParser from "./ArrayParser";
import { Parser } from "./types";

export default {
  object: (...args: ConstructorParameters<typeof ObjectParser>) => new ObjectParser(...args),
  array: <T extends Parser>(parser: T, length: number) => new ArrayParser(parser, length),
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
