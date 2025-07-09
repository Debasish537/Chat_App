// import User from "../models/User.js";
// import jwt  from "jsonwebtoken";
// //Middleware to protect routes



// export const protectRoute =async (req, res, next) =>{
//     try {
//         const token = req.header.token; //pass token from frontend header for every api request

//         const decoded= jwt.verify(token,process.env.JWT_SECRET)

//         const user = await User.findById(decoded.userId).select("-password");

//         if(!user){
//             return res.json({success:false,message:"User not found"})
//         }

//         req.user =user;

//         next();//it will execute the controller function
//     } catch (error) {
//         console.log(error.message);
        
//         res.json({success:false,message:error.message})
//     }
// }





// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ success: false, message: "JWT must be provided" });
//         }

//         const token = authHeader.split(" ")[1]; // Extract token

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.userId || decoded._id).select("-password");

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         req.user = user;
//         next(); // Proceed to controller
//     } catch (error) {
//         console.log(error.message);
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };




// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Middleware to protect routes
// export const protectRoute = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization; // ✅ Read standard Authorization header

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.json({ success: false, message: "JWT must be provided" }); // ✅ Handle missing or wrong format
//         }

//         const token = authHeader.split(" ")[1]; // ✅ Extract token after 'Bearer '

//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token

//         const user = await User.findById(decoded.userId || decoded._id).select("-password"); // ✅ Works with either key

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         req.user = user;

//         next(); // it will execute the controller function
//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message });
//     }
// };





import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("token"); // ✅ Correct way to read custom 'token' header

        if (!token) {
            return res.status(401).json({ success: false, message: "JWT must be provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token

        const user = await User.findById(decoded.userId || decoded._id).select("-password"); // ✅ get user from DB

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next(); // ✅ pass control to controller
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};
