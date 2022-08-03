const favouriteBlog = require("../list_helper.js").favouriteBlog;
const { listWithManyBlogs, listWithOneBlog, emptyList } = require("./testdata");

describe("totalLikes", () => {
    test("returns null if bloglist is empty", () => {
        expect(favouriteBlog(emptyList)).toEqual(null);
    });

    test("when list has only one blog, favourite blog equals that", () => {
        const result = favouriteBlog(listWithOneBlog);
        expect(result).toEqual({
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0,
        });
    });

    test("when list has many blogs, return the blog with most likes", () => {
        const result = favouriteBlog(listWithManyBlogs);
        expect(result).toEqual({
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0,
        });
    });
});
