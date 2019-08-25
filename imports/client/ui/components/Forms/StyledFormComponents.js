// @flow
import styled from 'styled-components';
import { Segment, Header, Grid } from 'semantic-ui-react';

export const StyledSegment = styled(Segment)`
  &.ui.segment {
    background-color: #eee;
    border: none;
    box-shadow: none;
    border-radius: 10px;
    width: 100%;
  }

  &.ui.padded.segment {
    padding: 2rem;
  }
`;

export const StyledHeader = styled(Header)`
  &.ui.header.fade {
    color: rgba(0, 0, 0, .3);
  }
`;

export const StyledBlock = styled.div`
  background: rgba(0, 0, 0, .05);
  padding: 20px;
  margin: 15px 0px;
  width: 100%;
  border-radius: 5px;
`;

export const StyledColumn = styled(Grid.Column)`
  background: rgba(0, 0, 0, .05);
  padding: 20px;
  border-radius: 5px;
`;

export const StyledDiv = styled.div`
  margin-top: ${props => props.top || '15px'};
  margin-bottom: ${props => props.bottom || '15px'};
`;
