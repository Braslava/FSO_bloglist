const dummy = require("../utils/list_helper.js").dummy;

describe("dummy", () => {
    test("returns 1", () => {
        const blogs = [];
        expect(dummy(blogs)).toBe(1);
    });
});
