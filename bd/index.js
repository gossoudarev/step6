/**
 * Created by eliasgoss on 31/01/2017.
 */

global.api = {};

const m = require('mongoose'),
    Schema = m.Schema,
    cred = require('./credentials1').mongo,
    opts = require('./opts');


m.Promise = global.Promise;
m.connect(cred.development.connectionString, opts, err=>{if(err)throw err;});

api.m = m;
api.UserSchema = new Schema( require('./user.schema') );
api.User = m.model('User', api.UserSchema);

/*
USAGE

 (async ()=>{
   const users = await api.User.find().exec();
   console.log (users);

 })();


 (async ()=>{
   const user = await api.User.findOne({user: 'student'}).exec();
   console.log (user);

 })();




 */