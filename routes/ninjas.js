var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/leaderboard',function(req, res){
  res.locals.user = req.session.user;
    var leaderboard =[];
    User.find({}).sort({elo: -1}).exec(function (err, userQ) {
      for(var i in userQ){
       leaderboard.push({user:userQ[i].username, elo: userQ[i].elo, id: userQ[i].id});
        }
        res.render('leaderboard', {
          leaderboard: leaderboard
        });
     });
});

router.post('/search', function(req, res){
  var username = req.body.ninja;
  User.findOne({"username": username}).exec(function(err, user){
    if(err || !user){
      res.send('No ninja with the name: ' + username);
      return;
    }
    res.redirect('/ninjas/'+user.id);
  });
});

router.get('/:id', function(req, res){
  res.locals.user = req.session.user;
 User.findById(req.params.id, function(err, user){
   if(err){
     res.send("no such user!");
     return;
   }
   var foo = new Date(user.date);
   var temp_result = "<b>Username: </b>"+user.username + "<br><br><b>Elo: </b>" + user.elo + "<br><br><b>Wins/Losses:</b> "+user.Wins+"/"+user.Losses+"<br><br> <b>Joined: </b>"+foo.toDateString();
   //res.send(temp_result);
   var progress = 0;
   var rank = "";
   if (user.elo <= 100){
     rank = 'bronze';
     progress = Math.round((user.elo/100) * 100);
   }else if (user.elo <= 200){
     rank = 'silver';
     progress = Math.round(((user.elo-100)/100)*100);
   }else if (user.elo <= 300){
     rank = 'gold'
     progress = Math.round(((user.elo-200)/100)*100);
   }else if (user.elo <= 500){
     rank = 'diamond';
     progress = Math.round(((user.elo-300)/200)*100);
   }
   res.render('profile', {
     username: user.username,
     elo: user.elo,
     wins: user.Wins,
     losses: user.Losses,
     date: foo.toDateString(),
     progressP: progress
   });
 });
});
module.exports = router;
