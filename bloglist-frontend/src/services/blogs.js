import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    console.log(response);
    return response.data;
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };
    console.log(config);
    const response = await axios.post(baseUrl, newObject, config);
    console.log(response);
    return response.data;
};

export default { getAll, create, setToken };
