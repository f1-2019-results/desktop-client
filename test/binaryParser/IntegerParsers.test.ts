require('../_index');
import bParse from '../../src/binaryParser';
import { Parser, Endianness, NumberParser } from '../../src/binaryParser/types';
import { expect } from 'chai';

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
        const parser = bParse[testCase.parserName]() as NumberParser;

        it('parses small values correctly', () => {
            testNumber(parser, 0, testCase.signed, Endianness.LittleEndian, 0);
            testNumber(parser, 1, testCase.signed, Endianness.LittleEndian, 0);
            testNumber(parser, 25, testCase.signed, Endianness.LittleEndian, 0);
            if (testCase.signed) {
                testNumber(parser, -1, testCase.signed, Endianness.LittleEndian, 0);
                testNumber(parser, -25, testCase.signed, Endianness.LittleEndian, 0);
            }
        });

        it('parses big values correctly', () => {
            const maxVal: bigint | number = 2n ** BigInt((parser.size * 8 - (testCase.signed ? 1 : 0) - 1));
            testNumber(parser, maxVal, testCase.signed, Endianness.LittleEndian, 0);
            testNumber(parser, maxVal - 1n, testCase.signed, Endianness.LittleEndian, 0);
        });

        it('Handles offset correctly', () => {
            testNumber(parser, 33, testCase.signed, Endianness.LittleEndian, 5);
            testNumber(parser, 33, testCase.signed, Endianness.BigEndian, 5);
        });

        it('Defaults to 0 offset', () => {
            parser.littleEndian();
            const num = parser.size > 4 ? 100n : 100;
            const buf = Buffer.concat([
                numberToBuffer(num, parser.size, testCase.signed, Endianness.LittleEndian),
                numberToBuffer(255, 1, false, Endianness.LittleEndian)
            ]);
            expect(parser.parse(buf)).to.eql(num);
        });
    });
}

function testNumber(parser: NumberParser, num: bigint | number, signed: boolean, endianness: Endianness, offset = 0): void {
    if (endianness === Endianness.BigEndian)
        parser = parser.bigEndian();
    else
        parser = parser.littleEndian();
    num = parser.size <= 4 ? Number(num) : BigInt(num);
    let buf = numberToBuffer(num, parser.size, signed, endianness);
    const padding = Buffer.alloc(offset).fill(255);
    buf = Buffer.concat([padding, buf, padding]);

    const val = parser.parse(buf, offset);
    expect(val).to.equal(num);
}

function numberToBuffer(num: number | bigint, size: number, signed: boolean, endianness: Endianness) {
    const buf = Buffer.alloc(size);
    let fnName = 'write'
    if (size > 4)
        fnName += 'Big'
    fnName += signed ? 'Int' : 'UInt';
    fnName += size * 8;
    if (size > 1)
        fnName += endianness == Endianness.BigEndian ? 'BE' : 'LE';
    // @ts-ignore
    buf[fnName](num, 0);
    return buf;
}
