import { connect } from '../db.js'

const mongoose = await connect()

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    companyName: { type: String, default: ''} 
})
const User = mongoose.model('user', userSchema, 'users')

export async function createUser(username, fullName, companyName) {
    const existingUser = await findUserByUsername(username)
    if (existingUser) throw new Error('User name already exists')
    return await User.create({ username, fullName, companyName })
}

export async function findUserById(id) {
    return await User.findById(id)
}

export async function findUserByUsername(username) {
    return await User.findOne({ username })
}

export async function updateUser(userUpdate) {
    const user = await findUserById(userUpdate._id)
    if (userUpdate.username !== user.username) {
        throw new Error("Cannot change username ")
    }
    user.fullName=userUpdate.fullName
    user.companyName= userUpdate.companyName
    return await user.save()
}

export async function setUserPassword(username, password) {
}

export async function findUserVerifyPassword(username, password) {
}

export async function deleteAllUsers() {
    return await User.deleteMany()
}