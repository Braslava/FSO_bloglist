const dummy = require("../list_helper.js.js").dummy;

describe("dummy", () => {
    test("returns 1", () => {
        const blogs = [];
        expect(dummy(blogs)).toBe(1);
    });
});
