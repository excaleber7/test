const userController = require("../controllers/userController");
const session = require("../middlewares/Session");

const router = require("express").Router();


// TODO: get user address and phone number when he make an order
// TODO: payment


router.post("/auth/google/user", userController.googleUser, session);

router.post("/auth/google/user/mobile", userController.googleUser, session); 

router.post("/auth/facebook/user", userController.facebookUser, session); 

router.post("/auth/facebook/user/mobile", userController.facebookUser, session); 


module.exports = router;