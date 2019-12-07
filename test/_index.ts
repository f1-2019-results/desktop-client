/**
 * TODO: Remove when https://github.com/mochajs/mocha/issues/4090 is fixed
 * BigInt cannot be serialized so mocha will show unhelpful error messages
 * Adding toJSON fixes it, but because of this some errors in the program
 * might be missed.
 */
// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
}

import * as chai from 'chai';
chai.should();

describe('Binary parser', () => {
    require('./binaryParser/ValueParsers.test');
    require('./binaryParser/ObjectParser.test');
    require('./binaryParser/StringParser.test');
});
