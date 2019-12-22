require('../_index');
import bParse from '../../src/binaryParser';
import { Endianness, NumberParser } from '../../src/binaryParser/types';
import { expect } from 'chai';

const numberParsers = [
    { parserName: 'float' },
    { parserName: 'double' },
];

for (const testCase of numberParsers) {

    describe(`${testCase.parserName} parser`, () => {
        // @ts-ignore
        const parser = bParse[testCase.parserName]() as NumberParser;

        it('parses small values correctly', () => {
            testNumber(parser, 0, 0);
            testNumber(parser, 1, 0);
            testNumber(parser, -1, 0);
            testNumber(parser, 0.5, 0);
            testNumber(parser, -0.5, 0);
        });

        it('parses big values correctly', () => {
            testNumber(parser, 123123123.001, 0);
            testNumber(parser, -123123123.001, 0);
        });

        it('Handles offset correctly', () => {
            testNumber(parser, -33.23, 5);
            testNumber(parser, -33.23, 5);
        });

        it('Defaults to 0 offset', () => {
            parser.littleEndian();
            const buf = Buffer.concat([
                numberToBuffer(100, parser.size, Endianness.LittleEndian),
                Buffer.alloc(2).fill(255),
            ]);
            expect(parser.parse(buf)).to.eql(100);
        });
    });
}

function testNumber(parser: NumberParser, num: number, offset = 0) {
    testNumberWithEndianness(parser, num, Endianness.LittleEndian, offset);
    testNumberWithEndianness(parser, num, Endianness.BigEndian, offset);
}

function testNumberWithEndianness(parser: NumberParser, num: number, endianness: Endianness, offset = 0) {
    if (parser.size === 4)
        num = roundToFloat(num);

    if (endianness === Endianness.BigEndian)
        parser = parser.bigEndian();
    else
        parser = parser.littleEndian();

    let buf = numberToBuffer(num, parser.size, endianness);
    const padding = Buffer.alloc(offset).fill(255);
    buf = Buffer.concat([padding, buf, padding]);

    const val = parser.parse(buf, offset);
    expect(val).to.equal(num);
}

function numberToBuffer(num: number | bigint, size: number, endianness: Endianness) {
    const buf = Buffer.alloc(size);
    let fnName = 'write'
    if (size === 4)
        fnName += 'Float'
    else if (size === 8)
        fnName += 'Double'
    else
        throw new Error(`Invalid float size ${size}`);
    fnName += endianness == Endianness.BigEndian ? 'BE' : 'LE';
    // @ts-ignore
    buf[fnName](num, 0);
    return buf;
}

function roundToFloat(number: number) {
    const buf = Buffer.alloc(4);
    buf.writeFloatLE(number, 0);
    return buf.readFloatLE(0);
}
