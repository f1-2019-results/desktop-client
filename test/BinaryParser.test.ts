import bParse from '../src/binaryParser';
import { Parser, Endianness } from '../src/binaryParser/types';
import { expect } from 'chai';

describe('binaryParser', () => {
    const numberParsers = [
        { parserName: 'int8', bits: 8, signed: true },
        { parserName: 'uint8', bits: 8, signed: false },
        { parserName: 'int16', bits: 16, signed: true },
        { parserName: 'uint16', bits: 16, signed: false },
        { parserName: 'int32', bits: 32, signed: true },
        { parserName: 'uint32', bits: 32, signed: false },
        { parserName: 'int64', bits: 64, signed: true },
        { parserName: 'uint64', bits: 64, signed: false },
    ];

    for (const testCase of numberParsers) {
        describe(`${testCase.parserName} parser`, () => {
            // @ts-ignore
            const parser = bParse[testCase.parserName]({ endianness: Endianness.LittleEndian }) as BParser;
            const convertNumber = (num: bigint | number) => parser.size <= 4 ? Number(num) : BigInt(num);

            it('parses small values correctly', () => {
                test(parser, convertNumber(0), testCase.signed, Endianness.LittleEndian, 0);
                test(parser, convertNumber(1), testCase.signed, Endianness.LittleEndian, 0);
                test(parser, convertNumber(25), testCase.signed, Endianness.LittleEndian, 0);
                if (testCase.signed) {
                    test(parser, convertNumber(-1), testCase.signed, Endianness.LittleEndian, 0);
                    test(parser, convertNumber(-25), testCase.signed, Endianness.LittleEndian, 0);
                }
            });

            it('parses big values correctly', () => {
                let maxVal: bigint | number = 2n ** BigInt((parser.size * 8 - (testCase.signed ? 1 : 0) - 1));
                test(parser, convertNumber(maxVal), testCase.signed, Endianness.LittleEndian, 0);
                test(parser, convertNumber(maxVal - 1n), testCase.signed, Endianness.LittleEndian, 0);
            });
        });
    }

    function test(parser: Parser, num: bigint | number, signed: boolean, endianness: Endianness, offset = 0) {
        const buf = Buffer.alloc(parser.size + offset);
        for (let i = 0; i < offset; i++)
            buf.writeInt8(255, i);
        let fnName = 'write'
        if (parser.size > 4)
            fnName += 'Big'
        fnName += signed ? 'Int' : 'UInt';
        fnName += parser.size * 8;
        if (parser.size > 1)
            fnName += endianness == Endianness.BigEndian ? 'BE' : 'LE';
        // @ts-ignore
        buf[fnName](num, offset);
        const val = parser.parse(buf, offset);
        expect(val).to.equal(num);
    }

    function safeBigintToNumber(num: bigint) {
        if (num > 2 ** 32)
            return
    }
});
