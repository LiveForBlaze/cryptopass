// @flow
// todo-1: write tests

import { Meteor } from 'meteor/meteor';

import './methods/init';
import './methods/ocr-cloud';
import './methods/zip';
import './methods/post';
import './methods/send-email';
import './methods/download-zip';
import './publications';
import './accounts/emails';
import './methods/image';
import './methods/json-open';
import './methods/clear-user-images-collection';
import './methods/check-email';
import './methods/blockchain';
import './methods/remove-user-data';
import './methods/update-user';
import './methods/read-blockchain';
import './methods/data-hash';
import './methods/get-data';

import './api/http/partners';
import './api/http/api';
import './api/http/api-return';
import './api/kyc';
import './api/api-return';
import './api/api_router';
import './methods/api-key';
import '../collections/api-keys';
import '../collections/validation';
import '../collections/partneruserstemp';

const LOGIN = 'postmaster@cryptopass.id'; // sandbox login: 'postmaster@sandbox64776f99847247bf90c2fbb1f205352b.mailgun.org'
const PASSWORD = '5ef8d3c56d1abbd48d9cc4a13c57e78b-e44cc7c1-414a0952'; // sandbox password: 'c9282aa3d17fbf05f3a321683c5ac87d-47317c98-b05bb0a6'

if (Meteor.isServer) {
  // eslint-disable-next-line
  Router.onBeforeAction(Iron.Router.bodyParser.json({
    limit: '50mb',
  }), {
    except: ['creditReferral'],
    where: 'server',
  });

  // eslint-disable-next-line
  Router.onBeforeAction(Iron.Router.bodyParser.raw({
    type: '*/*',
    only: ['creditReferral'],
    verify(req, res, body) {
      req.rawBody = body.toString();
    },
    where: 'server',
  }));
}

Meteor.startup(() => {
  process.env.MAIL_URL = `smtps://${LOGIN}:${PASSWORD}@smtp.mailgun.org:465`;
});
