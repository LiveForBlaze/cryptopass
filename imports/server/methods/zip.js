import { Meteor } from 'meteor/meteor';
import { devprint } from '../../api/helpers';

const Minizip = require('minizip-asm.js');
const fs = require('fs');

Meteor.methods({
  createZipfile({
    userId, password, userDoc,
  }) {
    if (!userId) {
      return null;
    }

    const mz = new Minizip();
    const createdAt = new Date().toISOString();
    const userDataObj = { _id: userId, createdAt, ...userDoc };

    const data = JSON.stringify(userDataObj, null, 2);
    const text = Buffer.from(data);

    // determina application working dir
    const dir = `./../../../../../app/private/${userId}`;
    const fileName = 'Cryptopass.zip';
    const fullPath = `${dir}/${fileName}`;

    // Creating user"s folder if not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // remove previous .zip archive version (if any)
    try {
      fs.accessSync(fullPath, fs.constants.F_OK);
      fs.unlinkSync(fullPath);
    } catch (err) {
      devprint('.zip doesnt exists, creating new one without deleting previous version');
    }

    // Saving data to zip
    mz.append(`${userId}/data.json`, text, { password });
    const images = fs.readdirSync(dir);
    images.forEach((image) => {
      const content = fs.readFileSync(`${dir}/${image}`);
      mz.append(`${userId}/${image}`, content, { password });
    });

    fs.writeFileSync(fullPath, Buffer.from(mz.zip()));

    return {
      fileName,
      filePath: fullPath,
    };
  },
  extractZip({ data, password }) {
    const zip = new Minizip(data);
    zip.list().forEach((file) => {
      const [userId, fileName] = file.filepath.split('/');
      const dir = `./../../../../../app/extracted/${userId}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(`${dir}/${fileName}`, zip.extract(file.filepath, { password }));
    });
  },
});
