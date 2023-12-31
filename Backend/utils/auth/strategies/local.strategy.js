const { Strategy } = require("passport-local");
const { getUser } = require("../../../controllers/auth");

const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await getUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports =  LocalStrategy ;