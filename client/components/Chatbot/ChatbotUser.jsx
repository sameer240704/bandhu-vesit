import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { AnimationMixer } from "three";
import { useFrame } from "@react-three/fiber";

const Chatbot = ({ animationNumber, ...props }) => {
  const { scene, animations } = useGLTF("/models/chatbot.glb");
  const mixer = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    if (animations.length) {
      if (!mixer.current) {
        mixer.current = new AnimationMixer(scene);
      }

      if (actionRef.current) {
        actionRef.current.fadeOut(0.2);
      }

      const action = mixer.current.clipAction(animations[animationNumber]);
      action.reset().fadeIn(0.2).play();
      actionRef.current = action;
    }
  }, [animationNumber, animations, scene]);

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
