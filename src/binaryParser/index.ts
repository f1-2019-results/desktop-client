import BArrayParser from './BArrayParser';
import BObjectParser from './BObjectParser';
import { BParser, BParserOptions, Endianness } from './bParse';

function object(fields: { [key: string]: BParser }, options: BParserOptions = { endianness: Endianness.LittleEndian }) {
    return new BObjectParser(fields, options);
}

function array(items: Array<BParser>, options: BParserOptions = { endianness: Endianness.LittleEndian }) {
    return new BArrayParser(items, options);
}

export default {
    object,
    array,
}