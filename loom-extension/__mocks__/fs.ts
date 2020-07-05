const fs = jest.genMockFromModule("fs") as any;

fs.mkdirSync = jest.fn();
fs.writeFileSync = jest.fn();
fs.watch = jest.fn();
fs.readFile = jest.fn();
fs.unlink = jest.fn();

module.exports = fs;
