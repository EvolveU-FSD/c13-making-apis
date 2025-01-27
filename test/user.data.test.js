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

    it.skip('should require a username', async () => {
        //execute
        try {
            await createUser('', 'Tony Enerson', 'InceptionU')
            fail('should have failed to create a duplicate username')
        }
        catch (err) {
            // happy case!
        }
    })

    it.skip('should require a full name', async () => {
        //execute
        try {
            await createUser('tonye', '', 'InceptionU')
            fail('should have failed to create a duplicate username')
        }
        catch (err) {
            // happy case!
        }
    })

    it.skip('should not require a company name', async () => {
        // setup
        const createdUser = await createUser('tonye', 'Tony Enerson')

        // execute
        const user = await findUserById(createdUser._id)

        // test
        expect(user.companyName).toEqual('')  // default value
    })

    it.skip('should not create a user with a duplicate username', async () => {
        //setup
        await createUser('tonye', 'Tony Enerson', 'InceptionU')

        //execute
        try {
            await createUser('tonye', 'Tony Eggbert', 'Cupcakes4Fun')
            fail('should have failed to create a duplicate username')
        }
        catch (err) {
            // happy case!
        }
    })

})