import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import Images from '../../api/filesCollection';
import { devprint } from '../../api/helpers';

const path = require('path');

function getFileName(type, i) {
  switch (type) {
    case 'pass':
      return `nationalid-${i + 1}`;
    case 'adr':
      return `address-${i + 1}`;
    default:
      return `selfie-${i + 1}`;
  }
}

Meteor.methods({
  saveImage({
    userId, imageName, uploadId, i,
  }) {
    const imagePath = Images.findOne({ name: imageName }).path;
    const imageExt = Images.findOne({ name: imageName }).extensionWithDot;
    const dir = `./../../../../../app/private/${userId}`;

    const fileName = getFileName(uploadId, i);

    const outputPath = `${dir}/${fileName}${imageExt}`;

    devprint('working directory: ', process.cwd());

    // Creating user"s folder if not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.copyFile(imagePath, outputPath, (err) => {
      if (err) {
        devprint('saveImage error -> ', err);
        throw err;
      }
    });
  },
});

Meteor.methods({
  deleteImage({
    userId, imageName, uploadId, i,
  }) {
    const imageExt = Images.findOne({ name: imageName }).extensionWithDot;
    const dir = `./../../../../../app/private/${userId}`;

    const fileName = getFileName(uploadId, i);

    const outputPath = `${dir}/${fileName}${imageExt}`;

    fs.unlink(outputPath, (err) => {
      if (err) {
        devprint('deleteImage error -> ', err);
        throw err;
      }
    });
  },
});

Meteor.methods({
  getImageURI({ userId, type }) {
    const fileName = ((typeId) => {
      switch (typeId) {
        case 'pass':
          return 'nationalid-1.jpg';
        case 'pass2':
          return 'nationalid-2.jpg';
        case 'pass3':
          return 'nationalid-3.jpg';
        case 'pass4':
          return 'nationalid-4.jpg';
        case 'pass5':
          return 'nationalid-5.jpg';
        case 'adr':
          return 'address-1.jpg';
        case 'adr2':
          return 'address-2.jpg';
        case 'selfie':
          return 'selfie-1.jpg';
        default:
          return 'selfie-1.jpg';
      }
    })(type);

    const extensions = ['jpg', 'gif', 'png', 'pdf'];
    const dir = `./../../../../../app/extracted/${userId}`;
    let fullPath = `${dir}/${fileName}`;
    let i = 0;

    while (i < extensions.length && !fs.existsSync(fullPath)) {
      fullPath = `${fullPath.replace(/\.[^.]+$/, '')}.${extensions[i]}`;
      i += 1;
    }

    const ext = path.extname(fullPath);
    const check = fs.existsSync(fullPath);
    const buf = check ? fs.readFileSync(fullPath) : null;
    const base64String = check ? buf.toString('base64') : null;
    const result = check ? `data:image/${ext};base64,${base64String}` : null;

    return result;
  },
});
