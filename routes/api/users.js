var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.put('/user', auth.required, function(req, res, next){
  console.log('payload = ', req.payload)
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.userName !== 'undefined'){
      user.userName = req.body.user.userName;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.firstName !== 'undefined'){
      user.firstName = req.body.user.firstName;
    }
    if(typeof req.body.user.lastName !== 'undefined'){
      user.lastName = req.body.user.lastName;
    }
    if(typeof req.body.user.mobile !== 'undefined'){
      user.mobile = req.body.user.mobile;
    }
    if(typeof req.body.user.city !== 'undefined'){
      user.city = req.body.user.city;
    }
    if(typeof req.body.user.age !== 'undefined'){
      user.age = req.body.user.age;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    console.log('err',err,'user',user,'info',info)
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(200).json(info);
    }
  })(req, res, next);
});

router.post('/users', function(req, res, next){
  var user = new User();

  user.userName = req.body.user.userName;
  user.email = req.body.user.email;
  user.firstName = req.body.user.firstName;
  user.lastName = req.body.user.lastName;
  user.mobile = req.body.user.mobile;
  user.city = req.body.user.city;
  user.age = req.body.user.age;
  user.setPassword(req.body.user.password);

  user.save().then(function(){
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

module.exports = router;
