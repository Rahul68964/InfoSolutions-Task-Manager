import jwt from "jsonwebtoken"

const adminAuth =  async (req, res, next) =>{
    const adminToken = req.headers.admintoken || req.headers.adminToken;
      
        if(!adminToken){
            return res.json({success:false, message:"Not Authorized Login Again"});
        }
      
        try {
            const token_decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
            req.body = req.body || {}; 
            req.body.adminId = token_decoded.id;
            next();
        } catch (error) {
            console.log("JWT verification error:", error);
            return res.json({success:false, message:error.message});
        }
}

export default adminAuth;