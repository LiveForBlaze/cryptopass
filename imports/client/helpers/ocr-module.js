import { Meteor } from 'meteor/meteor';
import { devprint } from '../../api/helpers';

async function checkSavedFile() {
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      Meteor.call('checkFiles', (error, response) => {
        if (error) {
          devprint(`checkSavedFile error: ${error}`);
          reject(new Error(error));
        }
        devprint(`checkFiles response: ${response}`);
        resolve(response);
      });
    });
  }
  const result = await asyncFunc();
  return result;
}

async function handleOcr(images) {
  const result = await Promise.all(images.map(async (image, index) => {
    const number = index + 1;
    function asyncFunc() {
      return new Promise((resolve, reject) => {
        Meteor.call('Mister_Kat', image, number, (error, response) => {
          if (error) {
            devprint(`handleOcr error: ${error}`);
            reject(new Error(error));
          }
          devprint(`handleOcr response: ${response}`);
          resolve(response);
        });
      });
    }
    const resultOcr = await asyncFunc();
    return resultOcr;
  }));

  return result;
}

async function checkResultOcr() {
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      Meteor.call('checkResult', (error, response) => {
        if (error) {
          devprint(`checkResultOcr error: ${error}`);
          reject(new Error(error));
        }
        devprint(`checkResultOcr response: ${response}`);
        resolve(response);
      });
    });
  }
  const result = await asyncFunc();
  return result;
}

async function joinResults() {
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      Meteor.call('concatResults', (error, response) => {
        if (error) {
          devprint(`joinResults error: ${error}`);
          reject(new Error(error));
        }
        devprint(`joinResults response: ${response}`);
        resolve(response);
      });
    });
  }
  const result = await asyncFunc();
  return result;
}

async function parseResult() {
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      Meteor.call('recognize', (error, response) => {
        if (error) {
          devprint(`parseResult error: ${error}`);
          reject(new Error(error));
        }
        devprint(`parseResult response: ${response}`);
        const data = {};
        data.firstName = response.firstName;
        data.lastName = response.lastName;
        data.dateOfBirth = response.dateOfBirth;
        // data.placeOfBirth = response.placeOfBirth;
        // data.citizenship = response.citizenship;
        data.passport = response.passport;
        data.issuedBy = response.issuedBy;
        data.issueDate = response.issueDate;
        data.expiryDate = response.expiryDate;
        resolve(data);
      });
    });
  }
  const result = await asyncFunc();
  return result;
}

export async function recognize(images) {
  const promises = [
    checkSavedFile(),
    handleOcr(images),
    checkResultOcr(),
    joinResults(),
    parseResult(),
  ];

  const result = await Promise.all(promises);

  return result;
}
