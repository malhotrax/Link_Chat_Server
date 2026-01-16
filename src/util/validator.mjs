export class Validator {
    static checkEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static checkPassword(password) {
        return typeof password === 'string' && password.length >= 6;
    }
   
    static checkUsername(username) {
        return typeof username === 'string' && username.length >= 3;
    }
}