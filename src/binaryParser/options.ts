export enum Endianness {
    LittleEndian,
    BigEndian
}

export interface DefaultOptions {
    endianness: Endianness;
    stringEncoding: string;
    trimStrings: boolean;
}

export interface NumberOptions {
    endianness: Endianness;
}

export interface StringOptions {
    stringEncoding?: string;
    trimStrings?: boolean;
}