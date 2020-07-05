const os = jest.genMockFromModule("os") as any;

os.tmpdir = () => "some_tmp_dir";

module.exports = os;
