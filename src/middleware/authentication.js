import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import { Strategy as LocalStrategy } from 'passport-local';
import { getCustomerByEmail, getCustomerById } from '../repositories/customers';

/**
 * Just a promise wrapper for passport's `req.logIn` function.
 */
export function login(req, customer) {
  return new Promise((resolve, reject) => {
    req.logIn(customer, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

// The LocalStrategy is invoked only on the login endpoint
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, verify));

passport.serializeUser((customer, callback) => callback(null, customer.id));

passport.deserializeUser((id, callback) => {
  getCustomerById(id)
    .then(found => callback(null, found))
    .catch(callback);
});

/**
 * Verifies email and password upon a login request.
 */
function verify(email, password, done) {
  getCustomerByEmail(email)
    .then((customer) => {
      if (!customer) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      if (!customer.password) {
        return done(null, false, { message: 'User has not defined a password' });
      }

      if (!bcrypt.compareSync(password, customer.password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, customer);
    })
    .catch(done);
}

export { passport };