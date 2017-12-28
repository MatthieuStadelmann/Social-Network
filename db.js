// DB set up ===================================================================
var spicedPg = require('spiced-pg');
var db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/SocialNetwork');
var path = require("path");
const s3 = require('./config.json')

//Function insertNewUser========================================================
function insertNewUser(first, last, email, password) {
  return db.query('INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [
    first, last, email || null,
    password || null
  ]).then((results) => {
    return results.rows[0].id
  })
};
exports.insertNewUser = insertNewUser;
//function getHashed============================================================
function getHashed(email) {
  const query = `SELECT password FROM users WHERE email = $1`;
  const params = [email];
  return db.query(query, params).then((results) => {
    return results.rows[0].password
  })
};
exports.getHashed = getHashed;
// function searchInfos=========================================================
function searchInfos(email) {
  const query = `SELECT id FROM users WHERE email = $1`
  const params = [email]
  return db.query(query, params).then((results) => {
    return results.rows[0]
  })
};
exports.searchInfos = searchInfos;
// get user infos===============================================================
function getInfos(id) {
  const query = `SELECT * FROM users WHERE id = $1`
  const params = [id]
  return db.query(query, params).then((results) => {
    console.log("results", results.rows[0])
    return results.rows[0]
  })
}
exports.getInfos = getInfos;
//POST upload Profilepic========================================================
function uploadPic(imgUrl, id) {
  const query = `UPDATE users
        SET imgUrl = $1
        WHERE id = $2
        RETURNING imgUrl`
  const params = [imgUrl, id];
  return db.query(query, params).then((results) => {
    results.rows.forEach((elem) => {
      elem.imgurl = s3.s3Url + elem.imgurl;
    })
    return results.rows[0];
  }).catch((err) => {
    console.log(err)
  })
};
exports.uploadPic = uploadPic;
//Update users with BIO=========================================================
function updateUser(bio, id) {
  const query = `UPDATE users
  SET bio = $1
  WHERE id = $2
  `
  const params = [bio, id];
  return db.query(query, params)
};
exports.updateUser = updateUser;
//CHECK STATUS OF THE RELATIONSHIP BETWEEN USERS================================
function getStatus(sender_id, recipient_id) {
  const query = `
  SELECT status, recipient_id, sender_id FROM friends
  WHERE (sender_id = $1 AND recipient_id = $2)
  OR (sender_id = $2 AND recipient_id = $1)
  `
  const params = [sender_id, recipient_id];
  return db.query(query, params).then((results) => {
    return results.rows[0]
  })
};
exports.getStatus = getStatus;
//UPDATE FRIENDREQUESTS=========================================================
//PENDING REQ
function pendingReq(status, recipient_id, sender_id) {
  console.log("pendingReq", sender_id, recipient_id);
  if (sender_id !== recipient_id) {
    const query = `
    INSERT INTO friends (status, recipient_id, sender_id) VALUES($1, $2, $3) RETURNING sender_id`
    const params = [status, sender_id, recipient_id];
    return db.query(query, params);
  }
};
exports.pendingReq = pendingReq;
//CANCEL REQ
function cancelReq(recipient_id, sender_id) {
  const query = `
   DELETE FROM friends
   WHERE recipient_id=$1 AND sender_id=$2
   OR recipient_id=$2 AND sender_id=$1
`
  const params = [recipient_id, sender_id];
  return db.query(query, params);
}
exports.cancelReq = cancelReq;
//ACCEPT FRIEND REQ
function acceptReq(status, sender_id, recipient_id) {
  console.log("inside acceptReq", status, sender_id, recipient_id)
  const query = `
  UPDATE friends
  set status = $1
  WHERE sender_id = $2
  AND recipient_id = $3
`
  const params = [status, sender_id, recipient_id];
  return db.query(query, params);
};
exports.acceptReq = acceptReq;
//FUNCTION GET FRIENDS==========================================================
function getFriends(id) {
  const query = `
  SELECT users.id, first, last, imgurl, status
  FROM friends
  JOIN users
  ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
  OR (status = 3 AND recipient_id = $1 AND sender_id = users.id)
  OR (status = 3 AND sender_id = $1 AND recipient_id = users.id)`
  const params = [id];
  return db.query(query, params).then((results) => {
    return results.rows
  });
};
exports.getFriends = getFriends;

//GET INFOS ABOUT ONLINE USERS==================================================
function getUsersByIds(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]).then((results) => {
      return results.rows
    });
};
exports.getUsersByIds = getUsersByIds;
//GET getSpecificUser===========================================================
function getSpecificUser(id) {
  const query = `SELECT * FROM users WHERE id = $1`
  return db.query(query, [id]).then((results) => {
    return results.rows[0]
  });
};
exports.getSpecificUser = getSpecificUser;
