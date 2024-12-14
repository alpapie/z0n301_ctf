const isMaliciousInput = (input) => {
    const sqlPatterns = [
        /('|;|--|\b(OR|AND|SELECT|DROP|INSERT|DELETE|UPDATE)\b)/gi, 
    ];
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
        /(on\w+="[^"]*"|javascript:)/gi,                      
    ];

    return sqlPatterns.some((pattern) => pattern.test(input)) ||
           xssPatterns.some((pattern) => pattern.test(input));
};

const failedAttempts = {};

const trackFailedAttempts = (ip) => {
    if (!failedAttempts[ip]) {
        failedAttempts[ip] = { count: 0, lastAttempt: Date.now() };
    }
    failedAttempts[ip].count++;
    failedAttempts[ip].lastAttempt = Date.now();

    if (failedAttempts[ip].count > 5) {
        return true; 
    }
    return false;
};



const loginAttempts = {}; 
const ATTEMPT_LIMIT = 5; 
const BLOCK_TIME = 60 * 1000; 


const canAttemptLogin = (login) => {
    const now = Date.now();
    const userAttempts = loginAttempts[login] || { count: 0, lastAttempt: now, blockedUntil: null };

    if (userAttempts.blockedUntil && now < userAttempts.blockedUntil) {
        return false;
    }

    if (now - userAttempts.lastAttempt > BLOCK_TIME) {
        loginAttempts[login] = { count: 0, lastAttempt: now, blockedUntil: null };
    }

    return true; 
};

 const recordLoginAttempt = (login, success = false) => {
    const now = Date.now();
    const userAttempts = loginAttempts[login] || { count: 0, lastAttempt: now, blockedUntil: null };

    if (success) {
        delete loginAttempts[login];
        return;
    }

    userAttempts.count += 1;
    userAttempts.lastAttempt = now;

    if (userAttempts.count >= ATTEMPT_LIMIT) {
        userAttempts.blockedUntil = now + BLOCK_TIME;
    }

    loginAttempts[login] = userAttempts;
};

module.exports={recordLoginAttempt,canAttemptLogin,trackFailedAttempts,isMaliciousInput}