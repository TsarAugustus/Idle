const chai = require('chai');
const expect = chai.expect;

describe("Test", function() {
    console.log('Running Test')
    const a = 1;
    const b = 2;
    expect(a + b).to.equal(3);
})