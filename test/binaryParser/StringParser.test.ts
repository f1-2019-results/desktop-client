require('../_index');
import bParse from '../../src/binaryParser';

describe('string parser', () => {

    it('Parses simple string correctly', () => {
        const parser = bParse.string().length(11).encoding('utf8');
        parser.parse(Buffer.from('Lorem ipsum'))
            .should.equal('Lorem ipsum');
    });

    it('Strips null characters correctly', () => {
        const parser = bParse.string().length(21).encoding('utf8');
        const buf = Buffer.concat([Buffer.from('Lorem ipsum'), Buffer.alloc(8), Buffer.from('aa')]);
        parser.parse(buf)
            .should.equal('Lorem ipsum');
    });

    it('Parses special characters correctly', () => {
        const input = 'Ḽơᶉëᶆ ȋṕšᶙṁ 😡';
        const buf = Buffer.from(input);
        const parser = bParse.string().length(buf.length).encoding('utf8');
        parser.parse(buf)
            .should.equal(input);
    });

    it('Uses utf8 as deafault encoding', () => {
        const input = 'Ḽơᶉëᶆ ȋṕšᶙṁ 😡';
        const buf = Buffer.from(input);
        const parser = bParse.string().length(buf.length);
        parser.parse(buf)
            .should.equal(input);
    });

    it('Can change encoding', () => {
        const input = 'Ḽơᶉëᶆ ȋṕšᶙṁ 😡';
        const buf = Buffer.from(input, 'utf16le');
        const parser = bParse.string().length(buf.length).encoding('utf16le');
        parser.parse(buf)
            .should.equal(input);
    });

});
