import styled from 'styled-components';

const HEADER_HEIGHT = '50px';
const VISUALIZER_HEADER_HEIGHT = '30px';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const CenteredWrapper = styled(Wrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Root = styled(Wrapper)`
  text-align: center;
`;

export const Header = styled(CenteredWrapper)`
  background-color: #282c34;
  height: ${HEADER_HEIGHT};
  color: white;
  font-size: 25px;
`;

export const Body = styled(Wrapper)`
  height: calc(100% - ${HEADER_HEIGHT});
  padding: 10px;
`;

export const VisualizerHeader = styled(Wrapper)`
  height: ${VISUALIZER_HEADER_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 10px;
  font-size: 20px;
`;

export const VisualizerBody = styled(Wrapper)`
  height: calc(100% = ${VISUALIZER_HEADER_HEIGHT});
`;
