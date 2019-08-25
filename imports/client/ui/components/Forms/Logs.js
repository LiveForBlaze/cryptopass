// @flow
import React from 'react';
import { translate } from 'react-i18next';
import { Header } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { StyledSegment } from './StyledFormComponents';
import { LogsItem } from './LogItem';

class Logs extends React.PureComponent {
  state = {
    blocks: [],
  };

  lastBlockHeight = 0;
  interval;

  componentDidMount() {
    Meteor.call('getTopBlock', {}, (err, res) => {
      const content = JSON.parse(res.content);
      this.getNextBlocks(content.result);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getNextBlocks = (startBlockId) => {
    this.lastBlockHeight = startBlockId;
    this.getBlock();
    this.interval = setInterval(this.getBlock, 5000);
  };

  getBlock = () => {
    Meteor.call('getBlock', this.lastBlockHeight - 1, (err, res) => {
      const content = JSON.parse(res.content);
      if (content.result) {
        this.lastBlockHeight += 1;
        this.setState({
          blocks: this.state.blocks.concat([content]),
        });
      }
    });
  };

  render() {
    const { t } = this.props;
    const { blocks } = this.state;
    return (
      <StyledSegment padded>
        <Header as="h2">{t('blockchain.Blockchain Logs')}:</Header>
        <div>
          {
            !!blocks.length &&
            blocks.map((item, i) => {
              let a = '#fff';
              if (i % 2 === 0 || i === 0) {
                a = '#e3e3e3';
              }
              return (
                <LogsItem data={item.result} bg={a} i={i + 1} key={item.result.hash} id={item.id} />
              );
            })
          }
        </div>
      </StyledSegment>
    );
  }
}

export const LogsTranslated = translate('common')(Logs);
