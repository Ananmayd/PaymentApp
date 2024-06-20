const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/paytm')
   .then(() => console.log('Connected!'));

   const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
    }
);

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    const saltRounds = 8;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    next();

})


const balanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        balance:{
            type: Number,
            required: true,
        },
    }
)

const Balance = mongoose.model('Balance', balanceSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Balance,
};