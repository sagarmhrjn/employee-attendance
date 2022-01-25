const User = require("../api/models/user.model");
const Role = require("../api/models/role.model");
const bcrypt = require("bcrypt");

(async () => {
    try {
        const role_count = await Role.estimatedDocumentCount();
        if (role_count > 0) return;
        const adminRole = await new Role({ name: "user" }).save();
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
        const userRole = await Role.findOne({ name: 'user' });
        console.log('User role created successfully.');
        if (userRole) {
            const hash = await bcrypt.hash('user123', 10);
            await new User({
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
                password: hash,
                role: userRole._id
            }).save();
            console.log('User created successfully.');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
})()
