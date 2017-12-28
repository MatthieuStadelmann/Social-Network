const knox = require('knox');
const fs = require('fs');

//KNOX S3 client 1: CREATE A CLIENT=============================================
let secrets;
if (process.env.NODE_ENV == 'production') {
  secrets = process.env;

} else {

  secrets = require('./secrets');
}
const client = knox.createClient({key: secrets.awsKey, secret: secrets.awsSecret, bucket: 'spicedling'});

exports.upload = function(file) {

  return new Promise(function(resolve, reject) {
    const s3Request = client.put(file.filename, {
      'Content-Type': file.mimetype, //headers
      'Content-Length': file.size, //headers
      'x-amz-acl': 'public-read'
    });

    const readStream = fs.createReadStream(file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
      const wasSuccessful = s3Response.statusCode == 200;


      if (wasSuccessful) {
        resolve()
      } else {
        reject();
      }
    });
  });

};
