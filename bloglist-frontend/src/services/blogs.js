import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    console.log("all blogs", response);
    return response.data;
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };
    console.log("config", config);
    const response = await axios.post(baseUrl, newObject, config);
    console.log("post response", response);
    return response.data;
};

const update = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };
    console.log("config", config);
    const response = await axios.put(
        `${baseUrl}/${newObject.id}`,
        newObject,
        config
    );
    console.log("put response", response);
    return response.data;
};

const deleteBlog = async (idToDelete) => {
    const config = {
        headers: { Authorization: token },
    };
    console.log("config", config);
    const response = await axios.delete(
        `${baseUrl}/${idToDelete}`,
        // newObject,
        config
    );
    console.log("delete response", response);
    return response.data;
};

export default { getAll, create, setToken, update, deleteBlog };
