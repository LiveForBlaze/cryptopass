// @flow
import React from 'react';
import styled from 'styled-components';
import { Loader, Dimmer, Segment } from 'semantic-ui-react';
import ImageZoom from 'react-medium-image-zoom';

const StyledImageSegment = styled(Segment)`
  &.ui.segment {
    padding: 0;
    box-shadow: none;
    border: 0;
    border-radius: 0;

    img {
      vertical-align: top;
    }
  }
`;

export const Image = ({ src, loading }) => (
  <StyledImageSegment>
    <Dimmer inverted active={loading}>
      <Loader inverted />
    </Dimmer>
    <ImageZoom
      image={{
        src,
        style: { width: '100%' },
      }}
      zoomImage={{
        src,
      }}
    />
  </StyledImageSegment>
);

Image.defaultProps = {
  src: 'http://via.placeholder.com/800x600',
  loading: false,
};
