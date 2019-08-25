// @flow
import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { devprint } from '../../../../api/helpers';

type propTypes = {
  users: Array<Object>,
};

function handleSendData() {
  Meteor.call('sendData', (error) => {
    devprint('---[ Meteor.call: sendData ]---');
    if (error) {
      devprint(error);
    } else {
      devprint('-OK-');
    }
  });
}

/**
 * @pure: ?true
 * @hasTests: false
 */
export function AdminTable(props: propTypes): Component {
  const Rows = props.users.map(user => (
    <Table.Row key={user._id}>
      <Table.Cell>
        {user.username}
        {
          user.emails[0].verified ?
            <div className="text-success">
              <small>verified</small>
            </div> :
            <div className="text-danger">
              <small>unverified</small>
            </div>
        }
      </Table.Cell>
      <Table.Cell>{user.createdAt.toDateString()}</Table.Cell>
      <Table.Cell>{user.profile.firstName}</Table.Cell>
      <Table.Cell>{user.profile.lastName}</Table.Cell>
      <Table.Cell>{user.identity.dateOfBirth}</Table.Cell>
      <Table.Cell>{user.identity.placeOfBirth}</Table.Cell>
      <Table.Cell>{user.phone ? user.phone.phone : ''}</Table.Cell>
      <Table.Cell><Button onClick={handleSendData}>Send Data</Button></Table.Cell>
    </Table.Row>
  ));


  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Registered</Table.HeaderCell>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell>DOB</Table.HeaderCell>
          <Table.HeaderCell>POB</Table.HeaderCell>
          <Table.HeaderCell>Phone</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Rows}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={7} />
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
