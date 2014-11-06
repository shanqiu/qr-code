var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define User schema 
var ownerSchema = new Schema({ 
    wechat_link : String, 
    ios_link : String, 
    android_link : String,
    user_email:String,
    url_id:String
});
// export them 
module.exports = mongoose.model('Owner', ownerSchema);
// exports.Owner = mongoose.model('Owner', _Owner);