import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { settings as cloudinarySettings } from '../../../api-third-party/cloudinary/settings';
import { devprint } from '../../../api/helpers';

export class ImageUploadControl extends React.Component {
  openUploadWidget = () =>
    // todo-1: cloudinary is loaded in html - fix it
  // eslint-disable-next-line no-undef
    cloudinary.openUploadWidget(
      Object.assign(
        {},
        cloudinarySettings,
        { folder: `${this.props.userId}/${this.props.docType}` }
      ),
      (error, result) => {
        devprint(error, result);
      },
    );

  render() {
    return (
      !this.props.submitted ?
        <Button onClick={this.openUploadWidget}>{this.props.btnText}</Button> :
        <div style={{ fontWeight: 'bold', color: 'green' }}>{this.props.text}</div>
    );
  }
}
