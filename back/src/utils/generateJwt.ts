import jwt from "jsonwebtoken";

function generateJwt(
    payload: string | object | Buffer,
    secretKey: jwt.Secret,
    expiresIn: string,
) {
    return jwt.sign(payload, secretKey, {
        expiresIn: expiresIn,
        issuer: "DaechanJo",
    });
}

export default generateJwt;
