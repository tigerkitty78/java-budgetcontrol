import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

const Cat = () => {
  // Load the 3D cat model using the useGLTF hook
  const { scene } = useGLTF('../../public/scene.gltf'); // Replace with the path to your .glb file
  return <primitive object={scene} scale={0.5} />;
};

const Game = () => {
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    // Logic for changing question, animating cat, etc.
  };

  return (
    <div>
      <h1>Financial Game</h1>
      <p>Score: {score}</p>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Cat />
        <OrbitControls /> {/* This allows you to drag the scene around */}
      </Canvas>
      <div>
        <button onClick={() => handleAnswer(true)}>Correct Answer</button>
        <button onClick={() => handleAnswer(false)}>Incorrect Answer</button>
      </div>
    </div>
  );
};

export default Game;
