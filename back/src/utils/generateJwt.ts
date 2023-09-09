import jwt from "jsonwebtoken";

function generateJwt(
	payload: string | object | Buffer,
	secretKey: jwt.Secret,
	expiresIn: any,
) {
	return jwt.sign(payload, secretKey, {
		expiresIn: expiresIn,
		issuer: "DaechanJo",
	});
}

export default generateJwt;
