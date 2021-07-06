import React, { ReactElement } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Camera } from "three";

function Box(): ReactElement {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 10, 0] }));
  return (
    <mesh
      ref={ref}
      onClick={() => {
        api.velocity.set(0, 10, 0);
      }}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  );
}

function Plane(): ReactElement {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshLambertMaterial attach="material" color="#BC2732" />
    </mesh>
  );
}

export default function Home(): ReactElement {
  return (
    <Canvas>
      <OrbitControls />
      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.5} />
      <Physics>
        <Box />
        <Plane />
      </Physics>
    </Canvas>
  );
}
