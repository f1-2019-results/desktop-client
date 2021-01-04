import { Endianness } from './types';

export interface DefaultOptions {
    endianness: Endianness;
    stringEncoding: BufferEncoding;
    trimStrings: boolean;
}

export interface NumberOptions {
    endianness: Endianness;
}

export interface StringOptions {
    stringEncoding?: string;
    trimStrings?: boolean;
}