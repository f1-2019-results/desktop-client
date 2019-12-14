/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as parsers from './valueParsers';
import ObjectParser from './ObjectParser';
import StringParser from './StringParser';
import ArrayParser from './ArrayParser';

function createFactoryFunction<A extends any[], R>(constructor: new (...args: A) => R): (...args: A) => R {
  return (...args) => new constructor(...args);
}

export default {
  object: createFactoryFunction(ObjectParser),
  array: createFactoryFunction(ArrayParser),
  string: createFactoryFunction(StringParser),
  int8: createFactoryFunction(parsers.Int8Parser),
  uint8: createFactoryFunction(parsers.Uint8Parser),
  int16: createFactoryFunction(parsers.Int16Parser),
  uint16: createFactoryFunction(parsers.Uint16Parser),
  int32: createFactoryFunction(parsers.Int32Parser),
  uint32: createFactoryFunction(parsers.Uint32Parser),
  int64: createFactoryFunction(parsers.Int64Parser),
  uint64: createFactoryFunction(parsers.Uint64Parser),
};
