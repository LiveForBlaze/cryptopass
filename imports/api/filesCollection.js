import { FilesCollection } from 'meteor/ostrio:files';

const Images = new FilesCollection({
  storagePath: () => './../../../../../app/private/uploads/images',
  collectionName: 'Images',
  permissions: 0o755,
  allowClientCode: true,
  cacheControl: 'public, max-age=31536000',
  debug: true,
  onbeforeunloadMessage() {
    return 'Upload is still in progress! Upload will be aborted if you leave this page!';
  },
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.ext)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  downloadCallback(fileObj) {
    if (this.params.query.download === 'true') {
      // Increment downloads counter
      Images.update(fileObj._id, { $inc: { 'meta.downloads': 1 } });
    }
    // Must return true to continue download
    return true;
  },
  protected(fileObj) {
    // Check if current user is owner of the file
    return fileObj.meta.owner === this.userId;
  },
});

export default Images;
