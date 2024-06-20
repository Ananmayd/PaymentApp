const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const bcrypt = require("bcrypt")
const { authMiddleware } = require("../middleware");

const userRouter = express.Router();

const signupSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

userRouter.post("/signup", async (req, res) => {
    
    // const body = req.body;
    const { success } = signupSchema.safeParse(req.body);

    if(!success) return res.json({
        message: "Incorrect Credentials"
    })

    const user = await User.findOne({
        email: req.body.email
    });
    
    if(user) return res.json({
        message: "Email already taken",
        email: req.body.email,
    })

    const newUser = await User.create(req.body);

    const token = jwt.sign({
        userId: newUser._id,
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        password: req.body.password,
        token: token
    })

});

userRouter.post("/signin", async(req, res) => {
    
    const { email, password, _id } = req.body;
    // const password = body.password;

    const user = await User.findOne({
        email,
    });

    console.log(user);

    if(!user) return res.json({
        message: "Email not registered."
    })

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.json({
        message: "Wrong password."
    })

    const token = jwt.sign({
        userId: _id,
    }, JWT_SECRET)

    res.json({
        message: "User Signed in successfully",
        token: token
    })    

});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

userRouter.put("/", authMiddleware, async (req, res) => {
     
    const { success } = updateBody.safeParse(req.body);

    if(!success) return res.status(411).json({
        message: "Error while updating information.",
    })

    await User.updateOne(req.body, {
        id: userId,
    })

    res.json({
        message: "Updated successfully."
    })

});

userRouter.get("/bulk", async(req, res) => {

    const filter = req.query.filter || "" ;

    const  users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
            },
            lastName: {
                "$regex": filter,
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id
        }))
    })

})

module.exports = userRouter;
