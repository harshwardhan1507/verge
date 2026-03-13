import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Vec3, Geometry } from 'ogl';

export interface ParticlesProps {
  particleColors?: string[];
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  pixelRatio?: number;
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute float scale;
  attribute vec3 color;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;
  uniform bool uRotate;

  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    if (uRotate) {
      float angle = uTime * uSpeed * 0.2;
      float s = sin(angle);
      float c = cos(angle);
      float x = pos.x * c - pos.z * s;
      float z = pos.x * s + pos.z * c;
      pos.x = x;
      pos.z = z;
    }

    vColor = color;
    gl_Position = vec4(pos, 1.0);
    gl_PointSize = uSize * scale;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec3 vColor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function Particles({
  particleColors = ['#ffffff'],
  particleCount = 200,
  particleSpread = 8,
  speed = 0.1,
  particleBaseSize = 80,
  moveParticlesOnHover = true,
  alphaParticles = true,
  disableRotation = false,
  pixelRatio = window.devicePixelRatio || 1,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({
      alpha: alphaParticles,
      antialias: true,
    });

    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      renderer.dpr = pixelRatio;
    };

    resize();
    window.addEventListener('resize', resize);

    // Scene
    const camera = new Camera(gl);
    camera.position.set(0, 0, 5);

    const scene = new Transform();

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const colorVec = new Vec3();

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * particleSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * particleSpread * 0.6;
      positions[i3 + 2] = (Math.random() - 0.5) * particleSpread;

      scales[i] = 0.5 + Math.random();

      const hex =
        particleColors[Math.floor(Math.random() * particleColors.length)];
      colorVec.set(
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      );

      colors[i3] = colorVec.x;
      colors[i3 + 1] = colorVec.y;
      colors[i3 + 2] = colorVec.z;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      scale: { size: 1, data: scales },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uSize: { value: particleBaseSize },
        uRotate: { value: !disableRotation },
      },
      transparent: alphaParticles,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    mesh.setParent(scene);

    let time = 0;

    const update = () => {
      time += 0.016;
      program.uniforms.uTime.value = time;
      renderer.render({ scene, camera });
      rafRef.current = requestAnimationFrame(update);
    };

    update();

    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (!moveParticlesOnHover) return;
      const rect = container.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      camera.position.x = pointerX * 1.2;
      camera.position.y = -pointerY * 1.2;
      camera.lookAt([0, 0, 0]);
    };

    container.addEventListener('pointermove', handlePointerMove);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', handlePointerMove);
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      // OGL cleans up when references are lost, but we can clear explicitly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (renderer as any).gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    alphaParticles,
    disableRotation,
    moveParticlesOnHover,
    particleBaseSize,
    particleColors,
    particleCount,
    particleSpread,
    pixelRatio,
    speed,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    />
  );
}

export default Particles;

