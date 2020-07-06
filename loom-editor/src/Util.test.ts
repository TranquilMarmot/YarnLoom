import { isDark } from "./Util";

describe("Util", () => {
  describe("isDark", () => {
    it("returns true for dark colors and false for light colors", () => {
      expect(isDark("rgb(20, 20, 20)")).toBe(true);
      expect(isDark("rgb(200, 200, 200)")).toBe(false);
    });

    it("works with hex and rgb and rgba", () => {
      expect(isDark("#FFFFFF")).toBe(false);
      expect(isDark("rgb(255, 255, 255)")).toBe(false);
      expect(isDark("rgba(255, 255, 255, 0.5)")).toBe(false);
    });
  });
});
