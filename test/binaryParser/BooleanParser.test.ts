require('../_index');
import bParse from '../../src/binaryParser';

describe('boolean parser', () => {
    const parser = bParse.boolean();

    it('parses false correctly', () => {
        const buf = Buffer.alloc(1).fill(0);
        parser.parse(buf).should.equal(false)
    });

    it('parses true correctly', () => {
        const buf = Buffer.alloc(1).fill(1);
        parser.parse(buf).should.equal(true)
    });

    it('parses all non 0 values to true', () => {
        const buf = Buffer.alloc(1).fill(123);
        parser.parse(buf).should.equal(true)
    });

    it('Handles offset correctly', () => {
        const buf = Buffer.concat([
            Buffer.alloc(1),
            Buffer.alloc(1).fill(1),
        ]);
        parser.parse(buf, 1).should.equal(true)
    });

    it('Defaults to 0 offset', () => {
        const buf = Buffer.concat([
            Buffer.alloc(1),
            Buffer.alloc(1).fill(1),
        ]);
        parser.parse(buf).should.equal(false)
    });
});
