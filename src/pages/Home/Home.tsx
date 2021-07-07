import React, { ReactElement, Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Canvas,
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Stars } from "@react-three/drei";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { a } from "@react-spring/three";
import { Vector3 } from "three";
import space from "../../assets/space.jpeg";
import sun from "../../assets/sun.jpeg";
import earth from "../../assets/earth.jpeg";

extend({ OrbitControls });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
    }
  }
}

function getRandom(start: number, end: number): number {
  return Math.random() * (start - end) + end;
}

function Sun(): ReactElement {
  const sunRef = useRef<THREE.Mesh>();

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.z += 0.01;
    }
  });
  const sunTexture = useLoader(THREE.TextureLoader, sun);
  return (
    <a.mesh ref={sunRef}>
      <sphereBufferGeometry attach="geometry" args={[300, 32, 32]} />
      <meshStandardMaterial attach="material" map={sunTexture} />
    </a.mesh>
  );
}

function Earth(): ReactElement {
  const earthTexture = useLoader(THREE.TextureLoader, earth);
  return (
    <a.mesh position={[-40, 0, 30]}>
      <sphereBufferGeometry attach="geometry" args={[3, 32, 32]} />
      <meshStandardMaterial attach="material" map={earthTexture} />
    </a.mesh>
  );
}

function Space() {
  const spaceTexture = useLoader(THREE.TextureLoader, space);
  const { scene } = useThree();
  scene.background = spaceTexture;
  return <></>;
}

function Torus({ radius }: { radius: number }): ReactElement {
  const torusRef = useRef<THREE.Mesh>();

  useFrame(() => {
    if (torusRef.current) {
      const rand = getRandom(0.01, 0.05);
      torusRef.current.rotation.x += 0.01 + rand;
      torusRef.current.rotation.y += 0.005 + rand;
      torusRef.current.rotation.z += 0.01 + rand;
    }
  });

  return (
    <a.mesh ref={torusRef} position={[-10, 0, 30]}>
      <torusBufferGeometry attach="geometry" args={[radius, 0.1, 10, 100]} />
      <meshStandardMaterial attach="material" color="grey" />
    </a.mesh>
  );
}

function CameraControls() {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef<OrbitControls>();
  useFrame(() => {
    if (controls.current) {
      controls.current.update();
    }
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      maxAzimuthAngle={Math.PI / 4}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={0}
    />
  );
}

export default function Home(): ReactElement {
  return (
    <Canvas camera={getCameraProps()}>
      <Suspense fallback={<></>}>
        <Space />
        <Sun />
        <Earth />
      </Suspense>
      <CameraControls />
      <Stars />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
    </Canvas>
  );
}

function getCameraProps() {
  const vector = new Vector3();
  vector.setZ(30);

  const props = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
    position: vector,
  };
  return props;
}
