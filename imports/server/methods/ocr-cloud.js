// @flow
import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import * as ocrsdkModule from '../../api-third-party/abby/ocr-cloud-api';
import { devprint } from '../../api/helpers';

const concat = require('concat-files');

Meteor.methods({
  Mister_Kat(fileName, number) {
    try {
      const userId = Meteor.user()._id;
      const dir = `./../../../../../app/private/${userId}`;
      const imagePath = `${dir}/nationalid-${number}.jpg`;
      const outputPath = `${dir}/result${number}.txt`;
      const appId = 'cryptVCard';
      const password = 'Atoj+i2Z0VHUMywGHx0Bdjnd';
      const ocrsdk = ocrsdkModule.create(appId, password);
      ocrsdk.serverUrl = 'http://cloud.ocrsdk.com'; // change to https for secure connection

      if (appId.length === 0 || password.length === 0) {
        throw new Error('Please provide your application id and password!');
      }

      const settings = new ocrsdkModule.ProcessingSettings();
      // Set your own recognition language and output format here
      // settings.language = "Chinees Simplified"; // Can be comma-separated list, e.g. "German,French".
      settings.language = 'ChinesePRC';
      settings.exportFormat = 'txt'; // All possible values are listed in "exportFormat" parameter description
      // at http://ocrsdk.com/documentation/apireference/processImage/

      devprint('Uploading image..');
      ocrsdk.processImage(imagePath, settings, (error, taskData) => {
        if (error) {
          devprint(`Error: ${error.message}`);
          return;
        }

        devprint('Upload completed.');
        devprint(`Task id = ${taskData.id}, status is ${taskData.status}`);
        if (!ocrsdk.isTaskActive(taskData)) {
          devprint(`Unexpected task status ${taskData.status}`);
          return;
        }

        ocrsdk.waitForCompletion(taskData.id, (waitError, data) => {
          if (error) {
            devprint(`Error: ${waitError.message}`);
            return;
          }

          if (data.status !== 'Completed') {
            devprint('Error processing the task.');
            if (data.error) {
              devprint(`Message: ${data.error}`);
            }
            return;
          }

          devprint('Processing completed.');
          devprint(`Downloading result to ${outputPath}`);

          ocrsdk.downloadResult(taskData.resultUrl.toString(), outputPath, (downloadError) => {
            if (error) {
              devprint(`Error: ${downloadError.message}`);
              return;
            }
            devprint('Done.');
          });
        });
      });
    } catch (err) {
      devprint(`Error: ${err.message}`);
    }
  },
  checkFiles() {
    const userId = Meteor.user()._id;
    const dir = `./../../../../../app/private/${userId}`;
    const filesOnServer = fs.readdirSync(dir, (error, contents) => contents);
    const res = filesOnServer.map((fileName) => {
      const re = /^nationalid-*/;
      return re.test(fileName);
    }).filter(value => value === true);
    return res.length === 2;
  },
  checkResult() {
    devprint('Start Check Result');
    const userId = Meteor.user()._id;
    const dir = `./../../../../../app/private/${userId}`;
    const filesOnServer = fs.readdirSync(dir, (error, contents) => contents);
    const filesForOCR = ['result1.txt', 'result2.txt'];
    const res = filesForOCR.map(fileName => filesOnServer.includes(fileName));
    const ok = res.filter(value => value === true);
    devprint(`CHECKING: ${ok}`);
    return ok.length === 2;
  },
  concatResults() {
    const userId = Meteor.user()._id;
    const dir = `./../../../../../app/private/${userId}`;
    const res1 = `${dir}/result1.txt`;
    const res2 = `${dir}/result2.txt`;
    concat([res1, res2], `${dir}/result.txt`, (err) => {
      if (err) throw err;
      devprint('Results joined');
    });
  },
  recognize() {
    const userId = Meteor.user()._id;
    const fullPath = `./../../../../../app/private/${userId}/result.txt`;
    const data = fs.readFileSync(fullPath, 'utf-8', (error, response) => {
      if (error) {
        devprint(`recognize failed: ${error}`);
      } else if (!response) {
        devprint(`invalid recognize response: ${typeof response}`);
      } else {
        devprint(`recognize response: ${response}`);
      }
      return response;
    });

    const ocrText = {};
    const lines = data.split('\n');

    lines.forEach((line) => {
      if (line.match(/姓名/)) {
        [ocrText.firstName, ocrText.lastName] = line.slice(2).trim().split('');
      }

      if (line.match(/出生/)) {
        const str = line.slice(2).trim();
        // "1994年9月16曰"
        const year = str.split('年')[0];
        const mon = str.split('年')[1].split('月')[0];
        const day = str.split('年')[1].split('月')[1].split('曰')[0];
        ocrText.dateOfBirth = ''.concat(day, mon, year);
      }

      if (line.match(/公民身份号码/)) {
        ocrText.passport = line.slice(7).trim();
      }

      if (line.match(/签发机关/)) {
        ocrText.issuedBy = line.slice(5).trim();
      }

      if (line.match(/有效期限/)) {
        const dates = line.slice(4).trim().split('-');
        const [revIssueDate, revExpiryDate] = dates;
        ocrText.issueDate = revIssueDate.split('.').reverse().join('.');
        ocrText.expiryDate = revExpiryDate.split('.').reverse().join('.');
      }
    });

    return ocrText;
  },
});
