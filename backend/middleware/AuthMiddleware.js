import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies["jwt-token"];

    if(!token) {
        return res.status(400).json({"message": "token invalid"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {id: decoded.id};
        next();
    } catch(err) {
        return res.status(403).json({"error": "failed to verify you"});
    }
}