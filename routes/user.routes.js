import express from 'express';
import {upload} from '../middlewares/multer.middleware.js'
import  {registerUser}  from '../controllers/user.controller.js'; // Import your controller function
const router = express.Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profilephoto",
            maxCount: 1
        }
    ]), 
    registerUser
);



export default router;