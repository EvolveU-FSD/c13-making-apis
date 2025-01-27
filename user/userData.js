import { connect } from '../db.js'

const mongoose = await connect()

const userSchema = mongoose.Schema({
    username: String,
    fullName: String,
    companyName: String
})
const User = mongoose.model('user', userSchema, 'users')

export async function createUser(username, fullName, companyName) {
    return await User.create({ username, fullName, companyName })
}

export async function findUserById(id) {
    return await User.findById(id)
}

export async function findUserByUsername(username) {
    return await User.findOne({ username })
}

export async function deleteAllUsers() {
    return await User.deleteMany()
}