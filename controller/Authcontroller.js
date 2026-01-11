const UserModel = require("../model/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {

    try {
        const { email, name, password, role } = req.body;
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(409).json({ message: "email already exist", success: false })
        }
        const userModel = new UserModel({ email, name, password, role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save()
        res.status(201).json({
            message: "signup successfully",
            success: true
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}
const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(403).json({ message: "email not exist", success: false })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(403).json({ message: "password does not match", success: false })
        }

        const jwttok = jwt.sign({ email: user.email, id: user._id, role: user.role },
            process.env.Jwt_SECRET,
            { expiresIn: "24h" }
        )

        res.status(200).json({
            message: "login success ",
            success: true,
            token: jwttok,
            email: user.email,
            name: user.name,
            userId: user._id,
            role: user.role

        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            success: false
        })

    }

}


module.exports = {

    signup,
    login
}


