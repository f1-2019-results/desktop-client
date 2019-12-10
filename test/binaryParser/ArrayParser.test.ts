require('../_index');
import bParse from '../../src/binaryParser';
import { Parser, Endianness, NumberParser } from '../../src/binaryParser/types';
import { expect } from 'chai';

describe('array parser', () => {

    const smallInput = Buffer.alloc(4);
    smallInput.writeUInt8(1, 0);
    smallInput.writeUInt8(2, 1);
    smallInput.writeUInt8(3, 2);
    smallInput.writeUInt8(4, 3);

    it('parses number array correctly', () => {
        const parser = bParse.array(
            bParse.uint8(),
            4,
        );
        parser.parse(smallInput)
            .should.eql([1, 2, 3, 4]);
    });

    it('parses nested object correctly', () => {
        const parser = bParse.array(
            bParse.array(bParse.uint8(), 2),
            2
        );
        parser.parse(smallInput).should.eql(
            [[1, 2], [3, 4]]
        );
    });

});
