import { Meteor } from 'meteor/meteor';
import Images from '../../api/filesCollection';
import { devprint } from '../../api/helpers';
import { PRIVATE_USER_ID, USER_ID, EXTRACTED } from '../constants.js';

export function saveImage(image, i) {
  if (!USER_ID) {
    return;
  }

  if (!image) {
    devprint('No image for save');
    return;
  }

  const uploadInstance = Images.insert({
    file: image,
    meta: {
      userId: USER_ID,
    },
    streams: 'dynamic',
    allowWebWorkers: false,
  }, false);

  uploadInstance.on('start', () => {
    devprint('Starting...');
  });

  uploadInstance.on('end', (error, fileObj) => {
    devprint(`On end File Object: ${fileObj}`);
  });

  uploadInstance.on('uploaded', (error, fileObj) => {
    devprint(`Uploaded: ${fileObj}`);

    Meteor.call('saveImage', {
      userId: USER_ID,
      imageName: image.name,
      uploadId: image.uploadId,
      i,
    }, (err, res) => {
      devprint(err || res);
    });
  });

  uploadInstance.on('error', (error) => {
    devprint(`Error during upload: ${error}`);
  });

  uploadInstance.start();
}

export function clearUserImagesFromCollection() {
  if (!USER_ID) {
    return;
  }

  Meteor.call('clearImages', { userId: USER_ID }, (error) => {
    if (error) {
      devprint(`Delete user images from collection failed: ${error}`);
    } else {
      devprint('Delete user images from collection successfully');
    }
  });
}

export function deleteImage(image, i) {
  if (!USER_ID) {
    return;
  }

  if (!image) {
    devprint('No image for delete');
    return;
  }

  Meteor.call('deleteImage', {
    userId: USER_ID,
    imageName: image.newName,
    uploadId: image.uploadId,
    i,
  }, (error) => {
    if (error) {
      devprint(`Delete image failed: ${error}`);
    } else {
      Meteor.call('clearImage', { name: image.newName, userId: USER_ID }, (err, res) => {
        if (err) {
          devprint(`Delete user image from collection failed: ${err}`);
        } else {
          devprint(`Delete user image from collection successfully: ${res}`);
        }
      });
    }
  });
}

export function getUserImageURI({ userId, type }, callback) {
  Meteor.call('getImageURI', { userId, type }, (error, response) => {
    if (error) {
      devprint(`getImage failed: ${error}`);
    } else if (!response) {
      devprint(`invalid response:  ${typeof response}`);
    } else if (typeof callback === 'function') {
      callback(response);
    }
  });
}

export function clearUserData() {
  if (!USER_ID) {
    return;
  }

  Meteor.call('removeUserData', { userFolder: PRIVATE_USER_ID }, (err, res) => {
    if (err) {
      devprint(`Remove user data failed: ${err}`);
    } else {
      devprint(`Remove user data successfully: ${res}`);
    }
  });
}

export function clearExtractedData({ userId }) {
  if (!userId) {
    return;
  }

  Meteor.call('removeUserData', { userFolder: `${EXTRACTED}/${userId}` }, (err, res) => {
    if (err) {
      devprint(`Remove extracted data failed: ${err}`);
    } else {
      devprint(`Remove extracted data successfully: ${res}`);
    }
  });
}
