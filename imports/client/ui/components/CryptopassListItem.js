// @flow
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { StyledColumn } from './Forms/StyledFormComponents';

export class CryptopassListItem extends React.PureComponent {
  render() {
    const { pendingUsers } = this.props;
    const list = pendingUsers.map((item, i) => (
      <Grid.Row key={item._id} index={i}>
        <StyledColumn mobile={16} tablet={16} computer={16}>
          {item.identity.firstName} {item.identity.lastName}: <Link href={`/check/${item._id}`} to={`/check/${item._id}`} target="_blank">{item.username}</Link>
        </StyledColumn>
      </Grid.Row>
    ));

    return (
      <div>
        {pendingUsers && list}
      </div>
    );
  }
}
