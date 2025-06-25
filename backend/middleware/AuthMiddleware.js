import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies["jwt-token"];
    console.log("token yeh hai: ", token);

    if(!token) {
        return res.status(400).json({"message": "token invalid"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        req.user = {id: decoded.id};
        next();
    } catch(err) {
        return res.status(403).json({"error": "failed to verify you"});
    }
}