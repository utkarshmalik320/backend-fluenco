import express from 'express';
import upload from 'wherever/your/upload/middleware/is/defined';
import { registerUser } from '../controllers/userController.js'; // Import your controller function

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
