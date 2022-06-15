const totalLikes = require("../utils/list_helper.js").totalLikes;
const { listWithManyBlogs, listWithOneBlog, emptyList } = require("./testdata");

describe("totalLikes", () => {
    test("returns zero if bloglist is empty", () => {
        expect(totalLikes(emptyList)).toBe(0);
    });

    test("when list has only one blog, equals the likes of that", () => {
        const result = totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    });

    test("when list has many blogs, equals the sum of likes of all posts", () => {
        const result = totalLikes(listWithManyBlogs);
        expect(result).toBe(36);
    });
});
