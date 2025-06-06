import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    
    const userToken = req.headers.userToken || req.headers.usertoken;
  
    if(!userToken){
        return res.json({success:false, message:"Not Authorized Login Again"});
    }
  
    try {
        const token_decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        req.body = req.body || {}; 
        req.body.userId = token_decoded.id;
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.json({success:false, message:error.message});
    }
  }

export default authUser;