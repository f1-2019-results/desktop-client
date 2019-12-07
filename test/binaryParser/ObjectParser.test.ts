require('../_index');
import bParse from '../../src/binaryParser';
import { Parser, Endianness, NumberParser } from '../../src/binaryParser/types';
import { expect } from 'chai';

describe('object parser', () => {

    it('parses simple object correctly', () => {
        const parser = bParse.object({
            a: bParse.int32(),
            b: bParse.string().length(10)
        });
        const buf = Buffer.alloc(14);
        buf.writeInt32LE(39178, 0);
        buf.write('abcdefghji', 4);
        parser.parse(buf)
            .should.eql({
                a: 39178,
                b: 'abcdefghji',
            });
    });

    it('parses nested object correctly', () => {
        const parser = bParse.object({
            b: bParse.object({
                val: bParse.string().length(1),
            }),
            c: bParse.object({
                val: bParse.string().length(1),
            }),
        });
        const buf = Buffer.from('ab');
        parser.parse(buf).should.eql({
            b: { val: 'a' },
            c: { val: 'b' }
        });
    });

    it('handles offset correctly', () => {
        const parser = bParse.object({
            b: bParse.object({
                val: bParse.string().length(1),
            }),
            c: bParse.object({
                val: bParse.string().length(1),
            }),
        });
        const buf = Buffer.from('xab');
        parser.parse(buf, 1).should.eql({
            b: { val: 'a' },
            c: { val: 'b' }
        });
    });
});
