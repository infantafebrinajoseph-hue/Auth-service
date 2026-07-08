const User = require("../models/user.model");

const findByEmail = async (email) => {
    return User.findOne({ email });
};

const findById = async (id) => {
    return User.findById(id).select("-password");
};

const create = async (userData) => {
    return User.create(userData);
};

module.exports = {
    findByEmail,
    findById,
    create
};
