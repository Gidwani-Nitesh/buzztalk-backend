const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    creation_dt: {
      type: Date,
      default: Date.now,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        login_dt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  })
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password =await bcrypt.hash(this.password, 12);
        console.log(this.password);
    //     this.confirm = await bcrypt.hash(this.confirm, 12);
    }
    next();
});
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        console.log('TOKEN',token);
        // let token = jwt.sign({_id:this._id},'Secret')
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        console.log(error);
    }
    console.log('tokennn');
}
// userSchema.methods.addMessage = async function(blogtitle, blogcontent){
//     try{
//         this.messages = this.messages.concat({blogtitle, blogcontent});
//         await this.save();
//         return this.messages;
//     }catch(error){
//             console.log(error);
//     }
// }
const User = mongoose.model('USER', userSchema);
module.exports = User