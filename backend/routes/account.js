const express = require("express");
const { authMiddleware } = require("../middleware");
const { Balance } = require("../db");
const mongoose = require("mongoose");


const accountRouter = express.Router();

accountRouter.get("/balance/:userId", authMiddleware, async (req, res) => {
    const account = await User.findOne({
        userId: req.params.userId,
    })

    res.json({
        balance: account.balance
    })
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    const { amount, to } = req.body;

    const account = await Balance.findOne({
        userId: req.userId,
    }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Transfer failed",
        })
    }

    const toAccount = await Balance.findOne({
        userId: to
    }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Transfer failed",
        })
    }

    await Balance.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Balance.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer Successful"
    })


});

module.exports = accountRouter;