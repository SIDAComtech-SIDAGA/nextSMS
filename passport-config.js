const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport) {
    const authenticateUsers = async (email, password, done) => {
        const user = getUserByEmail(email); // Replace with your actual user-fetching function
        if (user == null) {
            return done(null, false, { message: "No user found with that email" });
        }
        try {
            // Compare entered password with stored hashed password
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (e) {
            console.log(e);
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUsers));

    passport.serializeUser((user, done) => done(null, user.id)); // Customize if user doesn't have `id`
    passport.deserializeUser((id, done) => {
        // Replace with your actual user-fetching logic
        getUserById(id).then(user => done(null, user)).catch(err => done(err));
    });
}

module.exports = initialize;
