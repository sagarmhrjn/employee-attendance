const User = require("../api/models/user.model");
const Role = require("../api/models/role.model");
const bcrypt = require("bcrypt");
const { faker } = require('@faker-js/faker');

(async () => {
    try {
        const role_count = await Role.estimatedDocumentCount();
        if (role_count > 0) return;
        const adminRole = await new Role({ name: "admin" }).save();
        console.log('Admin role created successfully.');
        if (adminRole) {
            const hash = await bcrypt.hash('admin123', 10);
            await new User({
                first_name: "Sagar",
                last_name: "Maharjan",
                email: "sagar.maharjan@example.com",
                password: hash,
                role: adminRole._id
            }).save();
            console.log('Admin user created successfully.');
        }
        const userRole = await new Role({ name: 'user' }).save();
        console.log('User role created successfully.');
        if (userRole) {
            const hash = await bcrypt.hash('user123', 10);
            generateManyEmployee(100, hash, userRole._id);
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
})()


const generateOneEmployee = async (hash, role_id) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = firstName + ' ' + lastName
    try {
        const user = await new User({
            first_name: firstName,
            last_name: lastName,
            email: faker.internet.email(name),
            password: hash,
            role: role_id
        }).save();
        console.log(user, 'User created successfully.');
    } catch (err) {
        throw err
    }

};

const generateManyEmployee = async (count, hash, role_id) => {
    for (let i = 0; i < count; i++) {
        await generateOneEmployee(hash, role_id)
    }
};