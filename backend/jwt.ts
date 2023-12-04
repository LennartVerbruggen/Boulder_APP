import jwt from "jsonwebtoken";

export const generateJwtToken = (email: string): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'whattapp' };
    try{
        return jwt.sign({ email }, process.env.JWT_SECRET, options);
    } catch (error) {
        throw new Error("Could not generate token, see server logs for details.");
    }
}

export const endJwtToken = (email: string): string => {
    const options = { expiresIn: `1ms`, issuer: 'whattapp' };
    try{
        return jwt.sign({ email }, process.env.JWT_SECRET, options);
    } catch (error) {
        throw new Error("Could not generate token, see server logs for details.");
    }
}

const tokens = {
    generateJwtToken,
    endJwtToken
}
export default tokens;