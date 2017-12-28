const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression'); //middleware
const auth = require('./auth');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const db = require('./db');
const multer = require('multer');
const uidSafe = require('uid-safe');
const s3 = require('./s3');
const knox = require('knox');
const fs = require('fs');
const config = require('./config.json');
const csurf = require('csurf');

app.use(compression());
//USE COOKIE, COOKIE-SESSION, AND BODY PARSERS==================================
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cookieSession({
  name: `session`,
  secret: 'LIVE LONG EAT DÖNER',
  maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(csurf());
app.use(express.static('./public'));
app.use(express.static('./uploads'));

if (process.env.NODE_ENV != 'production') {
  app.use('/bundle.js', require('http-proxy-middleware')({target: 'http://localhost:8081/'}));
};
app.use(function(req, res, next) {
  res.cookie('mytoken', req.csrfToken());
  next();
});
//Setting upload images ========================================================
var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads/images');
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});
var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

// Upload route=================================================================
app.post('/upload', uploader.single('file'), (req, res) => {
  if (req.file) {
    s3.upload(req.file).then(() => {
      return db.uploadPic(req.file.filename, req.session.user.id)
    }).then((results) => {
      res.json({success: true, imgurl: results.imgurl})
    }).catch((err) => {
      console.log(err)
    })
  } else {
    res.json({success: false})
  };
});
//First page route =============================================================
app.get('/welcome/', function(req, res) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

//Registration route ===========================================================
const hashPassword = auth.hashPassword;
const insertNewUser = db.insertNewUser;
app.post('/register', (req, res) => {
  var first = req.body.first;
  var last = req.body.last;
  var email = req.body.email;
  var password = req.body.password;
  hashPassword(password).then((hashedpassword) => {
    insertNewUser(first, last, email, hashedpassword).then((id) => {
      req.session.user = {
        id: id,
        first: first,
        last: last,
        email: email
      };
      res.json({success: true})
    }).catch((err) => {
      console.log("HEY", err)
    })
  }).catch((err) => {
    console.log("HEY2", err)
  })
});
//Login route ==================================================================s
const checkPassword = auth.checkPassword;
const getHashed = db.getHashed;
const searchInfos = db.searchInfos;
app.post('/login', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  getHashed(email).then((hashedPassword) => {

    checkPassword(password, hashedPassword).then((doesMatch) => {

      if (doesMatch) {
        searchInfos(email).then((results) => {

          req.session.user = {
            id: results.id
          }
          res.json({success: true})
        });
      } else {}
    }).catch((err) => {
      console.log(err);
    })
  })
});
//GET user Route ===============================================================
const getInfos = db.getInfos;
app.get('/user/', function(req, res) {
  getInfos(req.session.user.id).then((user) => {
    if (!user.imgurl) {
      req.session.user = {
        id: user.id,
        first: user.first,
        last: user.last,
        email: user.email
      }
      res.json(user)
    } else {
      user.imgurl = config.s3Url + user.imgurl
      req.session.user = {
        id: user.id,
        first: user.first,
        last: user.last,
        email: user.email,
        imgurl: user.imgurl
      }
      res.json({
        id: user.id,
        first: user.first,
        last: user.last,
        email: user.email,
        imgurl: user.imgurl,
        bio: user.bio
      })
    }
  })
});

//SOCKET IO=====================================================================
const getUsersByIds = db.getUsersByIds;
let onlineUsers = [];
let onlined = [];
let ids;
const getSpecificUser = db.getSpecificUser;
let userDidJoin = !onlineUsers.find(onlineUsers => onlineUsers.userId == req.session.user.id);
let messages = [];

app.get("/get-all-online-users/:socketId", (req, res, next) => {

  if (!req.session.user) {
    return next();
  }
  onlineUsers.push({userId: req.session.user.id, socketId: req.params.socketId});

  if (userDidJoin) {
    let {id, first, last, email, imgurl} = req.session.user
    const heJustJoined = {
      id: id,
      first: first,
      last: last,
      email: email,
      imgurl: imgurl || '/images/default_profile_pic.png',
      socketID: req.params.socketID
    };
    io.emit('userJoined', {heJustJoined})
    io.emit('allMessages', {messages: messages});

  };

  ids = onlineUsers.map(user => user.userId);

  getUsersByIds(ids).then((onlineUsersData) => {

    onlineUsersData.forEach((onlineUsersData) => {
      if (!onlineUsersData.imgurl) {
        onlineUsersData.imgurl = '/images/default_profile_pic.png'
      } else {
        onlineUsersData.imgurl = config.s3Url + onlineUsersData.imgurl;
      }
    });

    res.json({success: true, onlineUsersInfos: onlineUsersData})
  }).catch((err) => {
    console.log(err)
  })
})

io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    const leftUser = onlineUsers.find(onlineUsers => onlineUsers.socketId == socket.id)
    onlineUsers = onlineUsers.filter(user => user != leftUser)
    var isStillHere = onlineUsers.some(user => user.userId == leftUser.userId)
    if (!isStillHere) {
      io.emit('userLeft', {leftUser});
    }
  });

  //SOCKET CHAT===========

  socket.on('chatMessage', function(msg) {

    const heSentTheMessage = onlineUsers.find(onlineUser => onlineUser.socketId == socket.id)
    getSpecificUser(heSentTheMessage.userId).then((messageSenderInfos) => {

      if (messageSenderInfos.imgurl == '/images/default_profile_pic.png') {
        messageSenderInfos.imgurl == '/images/default_profile_pic.png'
      } else {
        messageSenderInfos.imgurl = config.s3Url + messageSenderInfos.imgurl;
      }

      if (messages.length >= 10) {
        messages = messages.pop()
      }
      messages.push({message: msg, sender: messageSenderInfos})

      io.emit('chatMessage', {messages: messages});
    })
  })
});
// UPDATE USERS WITH BIO =======================================================
const updateUser = db.updateUser;
app.post('/submit', (req, res) => {
  updateUser(req.body.bio, req.session.user.id).then(() => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
// GET OTHER USER PROFILE ======================================================
app.get('/getuser/:userid', (req, res) => {
  if (req.params.userid == req.session.user.id) {
    res.json({success: false})
  } else {
    getInfos(req.params.userid).then((data) => {
      if (!data.imgurl) {
        data.imgurl = '/images/default_profile_pic.png'
      } else {
        data.imgurl = config.s3Url + data.imgurl;
      }
      res.json({success: true, data: data})
    }).catch((err) => {
      res.json({success: false})
    })
  }
});
//GET MUTUAL FRIENDS ===========================================================
app.get('/mutualfriends/:id', (req, res) => {

  logedInUser = req.session.user.id;
  otherProfileId = req.params.id;
  let mutualFriends = [];

  Promise.all([getFriends(otherProfileId), getFriends(logedInUser)]).then((results) => {

    let friends1 = results[0];
    let friends2 = results[1];

    friends1.forEach((friend) => {
      friends2.forEach((friend2) => {
        if (friend.id == friend2.id) {
          mutualFriends.push(friend)
        }
      })
    });
    mutualFriends.forEach((friend) => {
      if (!friend.imgurl) {
        friend.imgurl = '/images/default_profile_pic.png'
      } else {
        friend.imgurl = config.s3Url + friend.imgurl;
      }
    });
    res.json({success: true, mutualFriends: mutualFriends})

  }).catch((err) => {
    console.log(err)
  });
});
// CHECK STATUS OF THE RELATIONSHIP BETWEEN USERS===============================
const getStatus = db.getStatus;
app.get('/getstatus/:userid', (req, res) => {
  var otherUserId = req.params.userid;
  var logedInID = req.session.user.id;
  getStatus(otherUserId, logedInID).then((results) => {
    if (!results) {
      res.json({success: true, availableStatus: 'Send a Friend Request'})
    } else if (results.status == 1 && results.sender_id !== otherUserId && logedInID == results.sender_id) {
      res.json({success: true, availableStatus: 'Cancel Friend Request'})
    } else if (results.status == 1 && results.recipient_id == logedInID) {
      res.json({success: true, availableStatus: 'Accept Friend Request'})
    } else if (results.status == 3) {
      res.json({success: true, availableStatus: 'Terminate Friend Request'})
    }
  }).catch((err) => {
    res.json({success: false})
  })
});
//POST UPDATE STATUS OF THE RELATIONSHIP========================================
const pendingReq = db.pendingReq;
app.post('/pending', (req, res) => {
  pendingReq(req.body.status, req.session.user.id, req.body.otherid).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
//CANCEL FRIENDREQUEST =========================================================
const cancelReq = db.cancelReq;
app.post('/cancel', (req, res) => {
  cancelReq(req.body.otherid, req.session.user.id).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
//ACCEPT FRIENDSHIP ============================================================
const acceptReq = db.acceptReq;
app.post('/accept', (req, res) => {
  acceptReq(req.body.status, req.body.otherid, req.session.user.id).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
//TERMINATE FRIENDSHIP==========================================================
app.post('/terminate', (req, res) => {
  cancelReq(req.body.status, req.body.otherid, req.session.user.id).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
//GET FRIENDS===================================================================
const getFriends = db.getFriends;
app.get('/getfriends', (req, res) => {
  getFriends(req.session.user.id).then((results) => {
    results.forEach((friends) => {
      if (!friends.imgurl) {
        friends.imgurl = '/images/default_profile_pic.png'
      } else {
        friends.imgurl = config.s3Url + friends.imgurl;
      }
    })
    console.log("results friends", results)
    res.json({success: true, data: results})
  }).catch((err) => {
    res.json({success: false})
  })
});
//FRIENDS PAGE ACCEPT FRIEND REQUEST============================================
app.post('/friend-requests/:id', (req, res) => {
  acceptReq(3, req.params.id, req.session.user.id).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});
//FRIENDS PAGE TERMINATE FRIEND REQUEST=========================================
app.post('/friend/:id', (req, res) => {
  cancelReq(req.params.id, req.session.user.id).then((results) => {
    res.json({success: true})
  }).catch((err) => {
    res.json({success: false})
  })
});

//LOG out Route ================================================================
app.get('/logout/', (req, res) => {
  req.session = null;
  res.redirect('/');
});
// Redirect to welcome if not logedin ==========================================
app.get('*', function(req, res) {
  if (!req.session.user) {
    res.redirect('/welcome/')
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});
server.listen(8080, function() {
  console.log("I'm listening.")
});
