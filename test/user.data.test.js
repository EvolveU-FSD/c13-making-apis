import './testDb.js'

import { createUser, findUserById, findUserByUsername } from '../user/userData.js'

describe('user data layer', () => {

    it('should create a user with a username', async () => {
        //execute
        const user = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // assert/verify
        expect(user).toBeDefined()
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should find a user by username', async () => {
        // setup
        await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute
        const user = await findUserByUsername('tonye')

        // test
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should find a user by id', async () => {
        // setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute
        const user = await findUserById(createdUser._id)

        // test
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should not create a user with a number for a username', async () => {
        const user = await createUser(12, 'Tony Enerson', 'InceptionU')
        expect(user.username).toEqual('12')
    })

    it('should require a username', async () => {
        // execute/verify
        await expect(createUser(null, 'Tony Enerson', 'InceptionU'))
            .rejects.toThrow('user validation failed: username: Path `username` is required.')
    })

    it('should require a full name', async () => {
        //execute/verify
        await expect(createUser('tonye', null, 'InceptionU'))
            .rejects.toThrow('user validation failed: fullName: Path `fullName` is required.')
    })

    it('should require a username that is not an empty string', async () => {
        // execute/verify
        await expect(createUser('', 'Tony Enerson', 'InceptionU'))
            .rejects.toThrow('user validation failed: username: Path `username` is required.')
    })

    it('should require a full name that is not an empty string', async () => {
        //execute/verify
        await expect(createUser('tonye', '', 'InceptionU'))
            .rejects.toThrow('user validation failed: fullName: Path `fullName` is required.')
    })

    it('should not require a company name', async () => {
        // setup
        const createdUser = await createUser('tonye', 'Tony Enerson')

        // execute
        const user = await findUserById(createdUser._id)

        // test
        expect(user.companyName).toEqual('')  // default value
    })

    it('should not create a user with a duplicate username', async () => {
        //setup
        await createUser('tonye', 'Tony Enerson', 'InceptionU')

        await expect(createUser('tonye', 'Tony Eggbert', 'Cupcakes4Fun'))
            .rejects.toThrow('User name already exists')
    })

})