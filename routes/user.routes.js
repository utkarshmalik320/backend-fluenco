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




// import express from 'express';

// const router = express.Router();


// router.route("/registe").post('/', (req, res) => {
//   // Handle POST request
//   res.send('POST request received');
// });

// export default router;
