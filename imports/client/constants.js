import { Meteor } from 'meteor/meteor';

export const USER_ID = Meteor.userId();

export const ONLY_LETTERS = /^[^0-9[^$.|?*+()\]/\\!@#%&,;:'`~"{}<>—¿¡_-]*$/;
export const DD_MM_YYYY = /^\d{0,2}[.]{0,1}\d{0,2}[.]{0,1}\d{0,4}$/i;
export const MAX_COUNT_PASS = 5;
export const MAX_COUNT_SELFIE = 1;
export const MAX_COUNT_ADDR = 2;
export const MIN_LENGTH_USER_PASSWORD = 6;
export const MIN_LENGTH_PASSWORD_ZIP = 10;
export const MIN_LENGTH_PHONE_NUMBER = 8;
export const EXTRACTED = 'extracted';
export const PRIVATE = 'private';
export const PRIVATE_UPLOADS = 'private/uploads';
export const PRIVATE_USER_ID = `private/${USER_ID}`;
