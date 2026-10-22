import mongoose from 'mongoose'
import UserSchema from '../models/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export const Signup = async (req, res) => {
    const { name, email, password } = req.body

    try {

        const UserExisting = await UserSchema.findOne({ email })
        if (UserExisting) return res.status(400).json({ success: false, message: "User Already Exists" })

        const bcryptPass = await bcrypt.hash(password, 12)

        const UserSginup = await UserSchema.create({ name, email, password: bcryptPass })

        const token = jwt.sign({ email: UserSginup.email, id: UserSginup._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.status(200).json({ success: true, data: UserSginup, token: token })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong...", Reason: error.message })
    }
}
export const Login = async (req, res) => {
    const { email, password } = req.body

    try {
        const UserExisting = await UserSchema.findOne({ email })
        if (!UserExisting) return res.status(401).json({ success: false, message: "Invalid Credentials" })
        const DBpassHash = UserExisting.password
        const verify = await bcrypt.compare(password, DBpassHash)
        if (!verify) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }

        const token = jwt.sign({ email: UserExisting.email, id: UserExisting._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.status(200).json({ success: true, data: UserExisting, token: token })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}
export const GetAllUsers = async (req, res) => {


    try {
        const Users = await UserSchema.find()
        return res.status(200).json({ success: true, data: Users })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}
export const UpdateProfile = async (req, res) => {
    const { id: _id } = req.params
    const { name, about, tags } = req.body.editForm
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(401).json({ success: false, message: "User unavailable" })
    }
    try {
        const UpdatedProfile = await UserSchema.findByIdAndUpdate(_id, { $set: { name: name, about: about, tags: tags } }, { returnDocument: 'after' });

        return res.status(200).json({ success: true, data: UpdatedProfile })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}