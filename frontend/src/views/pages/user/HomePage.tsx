import '../../../assets/css/user/Home.css';
import UserNav from '../../partials/user/UserNav';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import i4 from '/images/cosySec.png';
import i5 from '/images/cosySec (2).webp';
import i7 from '/images/cosySec (1).webp';
import * as THREE from 'three';
import ix from '/images/cosySec (3).webp';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const modelImages: Record<'i4' | 'i5' | 'i7' | 'ix', string> = {
  i4,
  i5,
  i7,
  ix,
};

const modelKeys = ['i4', 'i5', 'i7', 'ix'] as const;
type ModelKey = typeof modelKeys[number];

interface BMW360ViewerProps {
  className?: string;
  autoRotateSpeed?: number;
  rotationStep?: number;
}

const HomePage: React.FC<BMW360ViewerProps> = ({
  className = '',
  autoRotateSpeed = 0.5,
  rotationStep = Math.PI / 16
}) => {
  const modelsSectionRef = useRef<HTMLDivElement | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [autoRotateEnabled, setAutoRotateEnabled] = useState<boolean>(true);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    
    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = null;
    }

    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }

    window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    if (mixerRef.current) {
      mixerRef.current.update(0.016);
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const loadCarModel = useCallback(() => {
    if (!sceneRef.current) return;

    const loader = new GLTFLoader();
    loader.load(
      '/models/bmw_x7_m60i.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);
        model.scale.set(1.5, 1.5, 1.5);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        sceneRef.current!.add(model);
        carRef.current = model;

        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
          mixerRef.current = mixer;
        }
      },
      undefined,
      (err) => {
        console.error("Failed to load car model:", err);
      }
    );
  }, []);

  const setupLighting = useCallback(() => {
    if (!sceneRef.current) return;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    sceneRef.current.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    sceneRef.current.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x007acc, 0.7);
    fillLight.position.set(-10, 10, -10);
    sceneRef.current.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(-5, 5, -15);
    sceneRef.current.add(rimLight);
  }, []);

  const createGround = useCallback(() => {
    if (!sceneRef.current) return;

    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2a2a4a,
      transparent: true,
      opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    sceneRef.current.add(ground);
  }, []);

  const initThreeJS = useCallback(() => {
    try {
      if (!canvasRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.set(3, 2, 5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = autoRotateEnabled;
      controls.autoRotateSpeed = autoRotateSpeed;
      controls.enableZoom = true;
      controls.minDistance = 3;
      controls.maxDistance = 15;
      controls.maxPolarAngle = Math.PI * 0.9;
      controlsRef.current = controls;

      // Load content
      loadCarModel();
      setupLighting();
      createGround();
      handleResize();
      window.addEventListener('resize', handleResize);

      // Start animation
      animate();
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Three.js:', error);
      setIsLoading(false);
    }
  }, [animate, autoRotateEnabled, autoRotateSpeed, createGround, handleResize, loadCarModel, setupLighting]);

  useEffect(() => {
    initThreeJS();
    return cleanup;
  }, [initThreeJS, cleanup]);

  const rotateCar = useCallback((direction: String): void => {
    if (!carRef.current) return;
    
    if (direction === 'left') {
      carRef.current.rotation.y += rotationStep;
    } else {
      carRef.current.rotation.y -= rotationStep;
    }
    
    const newRotation = (carRef.current.rotation.y * 180 / Math.PI) % 360;
    setCurrentRotation(Math.round(newRotation < 0 ? newRotation + 360 : newRotation));
  }, [rotationStep]);

  const toggleAutoRotate = useCallback((): void => {
    setAutoRotateEnabled(prev => !prev);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    }
  }, []);

  const resetView = useCallback((): void => {
    if (!carRef.current || !controlsRef.current) return;
    
    carRef.current.rotation.y = 0;
    setCurrentRotation(0);
    setAutoRotateEnabled(true);
    controlsRef.current.reset();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          rotateCar('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          rotateCar('right');
          break;
        case ' ':
          event.preventDefault();
          toggleAutoRotate();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [rotateCar, toggleAutoRotate, resetView]);

  

  return (
    <>
      <UserNav />
      <div className="homePageUserContainer">
        <section className="homePageUserHero">
          <div className="homePageUserHeroText">
            <h1>BMW ELECTRIC Bunks</h1>
            <button onClick={() => modelsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the Models
            </button>
          </div>
        </section>

        <section className="homePageUserIntro">
          <h2>THE BMW ELECTRIC CARS.</h2>
          <p>Discover the joy of electric driving in a BMW.</p>
        </section>

        <section className="homePageUserModels" ref={modelsSectionRef}>
          <h3>EXPERIENCE THE JOY OF ELECTRIC DRIVING</h3>
          <div className="homePageUserModelGrid">
            {modelKeys.map((model: ModelKey, index) => (
              <div className="homePageUserModelCard" key={index}>
                <img src={modelImages[model]} alt={`BMW ${model}`} />
                <h4>The BMW {model.toUpperCase()}</h4>
                <p>Discover the features of the BMW {model.toUpperCase()}.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homePageUserFind">
          <h3>FIND YOUR BMW ELECTRIC CAR.</h3>
          <div className="homePageUserFindDetails">
            <ul>
              <li>Light and fast navigation</li>
              <li>Detailed filters</li>
              <li>Comparison of different models</li>
            </ul>
            <img src="\images\cosy.webp" alt="Find your car" />
          </div>
        </section>

        <section className={`homePageUserFinance ${className}`}>
          <h3>BMW 360° View.</h3>
          <div className="homePageUserFinanceBox">
            
<div className="car-viewer-container" style={{
              width: '100%',
              height: '70vh',
              minHeight: '500px',
              position: 'relative',
              margin: '2rem 0',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <canvas 
                ref={canvasRef} 
                id="carCanvas"
                role="img"
                aria-label="Interactive 3D BMW car model"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              />
              
            </div>
        
            
            
            <div className="info-panel" style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '1.1rem' }}>
                Explore flexible BMW financing tailored to your needs. Use the controls above 
                to view your BMW from every angle and discover the perfect financing solution.
              </p>
              <small style={{ 
                display: 'block', 
                marginTop: '15px', 
                opacity: 0.8,
                fontSize: '0.9rem'
              }}>
                Keyboard shortcuts: ← → (rotate,left,up,down), Zoom (Zoom inn and out)
              </small>
            </div>
          </div>
        </section>

        <section className="homePageUserFAQ">
          <h3>FAQ</h3>
          <ul>
            <li>What is the range of a BMW electric car?</li>
            <li>How long does it take to charge?</li>
            <li>Where can I find charging stations?</li>
            <li>Is servicing different for electric models?</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default HomePage;