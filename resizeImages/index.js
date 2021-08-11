const im = require("imagemagick");
const fs = require("fs");
const os = require("os");
const { v4: uuid } = require("uuid");
const { promisify } = require("util");
const AWS = require("aws-sdk");

const resizeAsync = promisify(im.resize);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

AWS.config.update({ region: "us-east-1" });
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const filesProcessed = event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    // get file from s3
    const params = {
      Bucket: bucket,
      Key: filename,
    };
    const inputData = await s3.getObject(params).promise();

    // resize the file
    const tempFile = os.tmpdir() + "/" + uuid() + ".jpg";
    const resizeArgs = {
      srcData: inputData.Body,
      dstPath: tempFile,
      width: 150,
    };
    await resizeAsync(resizeArgs);

    // read the resized file
    const resizedData = await readFileAsync(tempFile);

    // upload new file to s3
    const targetFilename =
      filename.substring(0, filename.lastIndexOf(".")) + "-small.jpg";
    const destParams = {
      Bucket: bucket + "-dest",
      Key: targetFilename,
      Body: new Buffer(resizedData),
      ContentType: "image/jpeg",
    };

    await s3.putObject(params).promise();
    return await unlinkAsync(tempFile);
  });

  await Promise.all(filesProcessed);
  console.log("done");
  return "done";
};
