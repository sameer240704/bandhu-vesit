import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { AnimationMixer } from "three";
import { useFrame } from "@react-three/fiber";

const Chatbot = ({ ...props }) => {
  const { scene, animations } = useGLTF("/models/chatbot.glb");
  const mixer = useRef(null);

  useEffect(() => {
    if (animations.length) {
      mixer.current = new AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[1]);
      action.play();
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

export default Chatbot;
