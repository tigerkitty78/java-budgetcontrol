
 import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const BloomingFlowers = ({progress}) => {
     
 const MIN_SCALE = 0.3;
  const MAX_PROGRESS = 270;
  const adjustedProgress = Math.min(Math.max(progress, 0), MAX_PROGRESS);
  const scaleValue = MIN_SCALE + (adjustedProgress / MAX_PROGRESS) * (1 - MIN_SCALE);
  const isFullyBloomed = adjustedProgress >= MAX_PROGRESS;
  useEffect(() => {
    document.body.classList.add('not-loaded');
    const timeout = setTimeout(() => {
      document.body.classList.remove('not-loaded');
    }, 1000);

    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('not-loaded');
    };
  }, []);

   return (
    <Container>
      <Night />
      <Flowers $scale={scaleValue}>
        <Flower1 $isFullyBloomed={isFullyBloomed}>
          <Leafs1>
            <Leaf1_1 />
            <Leaf1_2 />
            <Leaf1_3 />
            <Leaf1_4 />
            <WhiteCircle />
            {[...Array(8)].map((_, i) => (
              <Light key={i} $index={i} />
            ))}
          </Leafs1>
          <Line1 $scale={scaleValue} $isFullyBloomed={isFullyBloomed}>
            {[...Array(6)].map((_, i) => (
              <LineLeaf key={i} $index={i} />
            ))}
          </Line1>
        </Flower1>

        <Flower2 $isFullyBloomed={isFullyBloomed}>
          <Leafs1>
            {/* These components need to be defined or imported */}
            {/* <Leaf2_1 />
            <Leaf2_2 />
            <Leaf2_3 />
            <Leaf2_4 /> */}
            <WhiteCircle />
            {[...Array(8)].map((_, i) => (
              <Light key={i} $index={i} />
            ))}
          </Leafs1>
          <Line1 $scale={scaleValue} $isFullyBloomed={isFullyBloomed}>
            {[...Array(4)].map((_, i) => (
              <LineLeaf key={i} $index={i} />
            ))}
          </Line1>
        </Flower2>
      </Flowers>
    </Container>
  );
};

// Animations
const bloom = (scale) => keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(${scale}); }
`;

const grow = (height) => keyframes`
  0% { height: 0; }
  100% { height: ${height}; }
`;

const moveFlower1 = (scale) => keyframes`
  0%, 100% { transform: rotate(2deg) scale(${scale}); }
  50% { transform: rotate(-2deg) scale(${scale * 0.95}); }
`;



const lightAnimation = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 1; transform: translateY(-5vmin) translateX(-2vmin); }
  50% { opacity: 1; transform: translateY(-15vmin) translateX(2vmin); }
  100% { opacity: 0; transform: translateY(-30vmin); }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 30vh;
  background: rgb(255, 255, 255);
  overflow: hidden;
  perspective: 1000px;

  .not-loaded * {
    animation-play-state: paused !important;
  }
`;

const Night = styled.div`
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  filter: blur(0.1vmin);
  
    radial-gradient(ellipse at bottom, #000, rgba(145, 233, 255, 0.2)),
    linear-gradient(90deg, rgb(0, 255, 250), rgb(240, 240, 240));
`;

const Flowers = styled.div`
  position: relative;
  transform: scale(${props => props.$scale * 0.9});
  transform-origin: bottom;
  transition: transform 0.5s ease-out;
`;

const FlowerBase = styled.div`
  position: absolute;
  bottom: 10vmin;
  transform-origin: bottom center;
  z-index: 10;
`;

const Flower1 = styled(FlowerBase)`
  animation: ${moveFlower1} 4s linear infinite;
  animation-play-state: ${props => props.$isFullyBloomed ? 'running' : 'paused'};
  left: -20%;
`;

const Flower2 = styled(FlowerBase)`
  left: 50%;
  transform: rotate(20deg);
  animation: ${moveFlower1} 4s linear infinite;
  animation-play-state: ${props => props.$isFullyBloomed ? 'running' : 'paused'};
`;

const Leafs1 = styled.div`
  position: relative;
  animation: ${bloom} 2s 0.8s backwards;
`;

const LeafBase = styled.div`
  position: absolute;
  bottom: 0;
  border-radius: 51% 49% 47% 53% / 44% 45% 55% 69%;
  background-image: linear-gradient(to top, #54b8aa, #a7ffee);
  transform-origin: bottom center;
  opacity: 0.9;
  box-shadow: inset 0 0 2vmin rgba(255, 255, 255, 0.5);
`;

const Leaf1_1 = styled(LeafBase)`
  width: 8vmin;
  height: 11vmin;
  transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg);
`;

const Leaf1_2 = styled(LeafBase)`
  width: 8vmin;
  height: 11vmin;
  transform: translate(-50%, -4%) rotateX(40deg);
`;

const Leaf1_3 = styled(LeafBase)`
  width: 8vmin;
  height: 11vmin;
  transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg);
`;

const Leaf1_4 = styled(LeafBase)`
  width: 8vmin;
  height: 8vmin;
  transform-origin: bottom left;
  border-radius: 4vmin 10vmin 4vmin 4vmin;
  transform: translate(-0%, 18%) rotateX(70deg) rotate(-43deg);
  background-image: linear-gradient(to top, #39c6d6, #a7ffee);
  z-index: 1;
  opacity: 0.8;
`;

const WhiteCircle = styled.div`
  position: absolute;
  left: -3.5vmin;
  top: -3vmin;
  width: 9vmin;
  height: 4vmin;
  border-radius: 50%;
  background-color: rgb(255, 254, 169);
`;

const Light = styled.div`
  position: absolute;
  bottom: 0vmin;
  width: 1vmin;
  height: 1vmin;
  background-color: ${props => props.$index % 2 === 0 ? 'rgb(255, 251, 0)' : '#23f0ff'};
  border-radius: 50%;
  filter: blur(0.2vmin);
  animation: ${lightAnimation} 4s linear infinite;
  left: ${props => {
    const positions = [-2, 3, -6, 6, -1, -4, 3, -6];
    return `${positions[props.$index]}vmin`;
  }};
  animation-delay: ${props => [1, 0.5, 0.3, 0.9, 1.5, 3, 2, 3.5][props.$index]}s;
`;

const Line1 = styled.div`
  height: ${props => props.$isFullyBloomed ? '70vmin' : `${70 * props.$scale}vmin`};
  width: 1.5vmin;
  background-image: linear-gradient(to left, rgb(0, 0, 0, 0.2), transparent, rgba(255, 255, 255, 0.2)),
    linear-gradient(to top, transparent 10%, #14757a, #39c6d6);
  box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.5);
  animation: ${props => grow(`${70 * props.$scale}vmin`)} 4s backwards;
`;

const LineLeaf = styled.div`
  --w: 7vmin;
  --h: calc(var(--w) + 2vmin);
  position: absolute;
  width: var(--w);
  height: var(--h);
  border-top-right-radius: var(--h);
  border-bottom-left-radius: var(--h);
  background-image: linear-gradient(to top, rgba(20, 117, 122, 0.4), #39c6d6);
  transform: ${props => {
    const transforms = [
      'rotate(70deg) rotateY(30deg)',
      'rotate(70deg) rotateY(30deg)',
      'rotate(-70deg) rotateY(30deg)',
      'rotate(-70deg) rotateY(30deg)',
      'rotate(70deg) rotateY(30deg) scale(0.6)',
      'rotate(-70deg) rotateY(30deg) scale(0.6)'
    ];
    return transforms[props.$index % 6];
  }};
  top: ${props => [20, 45, 12, 40, 0, -2][props.$index % 6]}%;
  left: ${props => [90, 90, -460, -460, 90, -450][props.$index % 6]}%;
`;

// Add similar styled components for Flower2, Leafs2, Line2, etc.

export default BloomingFlowers;