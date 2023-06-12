import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name) {
        next('name is required')
    }
    if (!email) {
        next('email is required')
    }
    if (!password) {
        next('Password is required')
    }
    const exisitingUser = await userModel.findOne({ email }).select("+password")
    if (exisitingUser) {
        next('Email is Already Exist')
    }
    const user = await userModel.create({ name, email, password });
    const token = user.createJWT();
    res.status(201).send({
        success: true, message: 'User Create Successfully', user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        }, token
    });
};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next('plz provide All the feild')
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        next('Invalied Email or Password')
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        next('Invalied Email or Password')
    }
    user.password = undefined;
    const token = user.createJWT();
    res.status(200).json({
        success: true,
        message: "Login SuccessFully",
        user,
        token
    })
}