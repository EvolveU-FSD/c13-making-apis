import { connect } from '../db.js'

const mongoose = await connect()

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    companyName: { type: String, default: ''} 
})
const User = mongoose.model('user', userSchema, 'users')

export async function createUser(username, fullName, companyName) {
    try {
        return await User.create({ username, fullName, companyName })
    }
    catch (err) {
        if (err.code === 11000) throw new Error('User name already exists')
        throw err
    }
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