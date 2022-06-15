const mostBlogs = require("../utils/list_helper.js.js").mostBlogs;
const { listWithManyBlogs, listWithOneBlog, emptyList } = require("./testdata");

describe("mostBlogs", () => {
    test("returns null if bloglist is empty", () => {
        expect(mostBlogs(emptyList)).toEqual(null);
    });

    test("when list has only one blog, returns the author of that blog and blog count 1", () => {
        const result = mostBlogs(listWithOneBlog);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            blogs: 1,
        });
    });

    test("when list has many blogs, returns the author of the biggest number of blogs", () => {
        const result = mostBlogs(listWithManyBlogs);
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3,
        });
    });
});
