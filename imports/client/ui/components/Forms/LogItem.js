// @flow
import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const Column = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  flex: 1;
  margin-bottom: ${props => props.bottom || '15px'};
  margint-right: ${props => props.right || '10px'};
  justify-content: space-between;
  margin-top: ${props => props.top || '5px'};
  background: ${props => props.bg || '#e3e3e3'};
  padding: ${props => props.padding || '15px;'};
  padding-left: ${props => props.pleft || '15px'};
  padding-right: ${props => props.pright || '15px'};
  flex-wrap: wrap;
  border-radius: 7px;
  font-size: ${props => props.size || '14px'};
`;
const Item = styled.div`
  box-sizing: content-box;
  font-size: ${props => props.size || '14px'};
  color: ${props => props.color || '#000'};
  text-align: left;
  word-break: break-all;
  font-weight: ${props => props.weight || '300'};
`;
const ItemLabel = styled.span`
  font-weight: 600;
  font-size: ${props => props.size || '16px'};
  margin-right: 5px;
  margin-bottom: ${props => props.margin || '0px'}
`;

export class LogsItem extends React.PureComponent {
  state = {
    detailed: false,
  };

  detailedInfo = () => {
    this.setState({
      detailed: !this.state.detailed,
    });
  };

  render() {
    const {
      data, bg, i, id,
    } = this.props;
    const { detailed } = this.state;
    const created = new Date(data.time * 1000);
    const alpha = detailed ? '0.7' : '0.2';
    const iconName = detailed ? 'minus' : 'plus';
    return (
      <div>
        <div>
          <Column direction="row" padding="0px" size="12px" bottom="0px" bg="#eee" pright="10px">
            <Item size="12px" color={`rgba(0, 0, 0, ${alpha})`} weight="600">Log {i}</Item>
            <Icon link name={iconName} size="large" onClick={this.detailedInfo} />
          </Column>
          <Column bg={bg}>
            <Item><ItemLabel>Id:</ItemLabel> {id}</Item>
            <Item><ItemLabel>Hash:</ItemLabel> {data.hash}</Item>
            <Item><ItemLabel>Time:</ItemLabel> {created.toString()}</Item>
            { detailed && (
            <div>
              <Item><ItemLabel>Size:</ItemLabel> {data.size}</Item>
              <Item><ItemLabel>Version:</ItemLabel> {data.version}</Item>
              <Item><ItemLabel>Previousblockhash:</ItemLabel> {data.previousblockhash}</Item>
              <Item><ItemLabel>Merkleroot:</ItemLabel> {data.merkleroot}</Item>
              <Item><ItemLabel>Time:</ItemLabel> {data.time}</Item>
              <Item><ItemLabel>Index:</ItemLabel> {data.index}</Item>
              <Item><ItemLabel>Nonce:</ItemLabel> {data.nonce}</Item>
              <Item><ItemLabel>Nextconsensus:</ItemLabel> {data.nextconsensus}</Item>
              <Item><ItemLabel>Invocation:</ItemLabel> {data.script.invocation}</Item>
              <Item><ItemLabel>Verification:</ItemLabel> {data.script.verification}</Item>
              <Item><ItemLabel>Confirmations:</ItemLabel> {data.confirmations}</Item>
              <Item><ItemLabel>Nextblockhash:</ItemLabel> {data.nextblockhash}</Item>
              <Column bg="#eee" top="10px">
                <ItemLabel margin="10px" size="20px">Transactions</ItemLabel>
                <Item><ItemLabel>Id:</ItemLabel> {data.tx[0].txid}</Item>
                <Item><ItemLabel>Size:</ItemLabel> {data.tx[0].size}</Item>
                <Item><ItemLabel>Type:</ItemLabel> {data.tx[0].type}</Item>
                <Item><ItemLabel>Version:</ItemLabel> {data.tx[0].version}</Item>
                <Item><ItemLabel>Nonce:</ItemLabel> {data.tx[0].nonce}</Item>
              </Column>
            </div>
            )}
          </Column>
        </div>
      </div>
    );
  }
}
