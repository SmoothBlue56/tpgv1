import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class TruckRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.truckModel = null;
        this.loader = new GLTFLoader();
        this.container = document.getElementById('truckDisplay');
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 3, 5);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);

        // Setup lighting
        this.setupLighting();
        
        // Load truck model
        this.loadTruckModel();

        // Setup animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);

        // Spotlight for dramatic effect
        const spotLight = new THREE.SpotLight(0xd4af37, 0.8, 30, Math.PI / 6, 0.1, 2);
        spotLight.position.set(0, 8, 8);
        spotLight.target.position.set(0, 0, 0);
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3a2817,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    loadTruckModel() {
        // Use the Tank model from the assets as a placeholder truck
        this.loader.load(
            'https://play.rosebud.ai/assets/Tank-Cw3Zvvkmom.glb?njoi',
            (gltf) => {
                this.truckModel = gltf.scene;
                this.truckModel.scale.set(1.5, 1.5, 1.5);
                this.truckModel.position.set(0, -0.5, 0);
                
                // Enable shadows
                this.truckModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Enhance materials
                        if (child.material) {
                            child.material.metalness = 0.7;
                            child.material.roughness = 0.3;
                        }
                    }
                });

                this.scene.add(this.truckModel);
                this.updateTruckColors();
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading truck model:', error);
                this.createFallbackTruck();
            }
        );
    }

    createFallbackTruck() {
        // Create a simple truck shape if model loading fails
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(3, 1, 1.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        
        const positions = [
            [-1.2, 0, 0.9],
            [1.2, 0, 0.9],
            [-1.2, 0, -0.9],
            [1.2, 0, -0.9]
        ];
        
        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos[0], pos[1], pos[2]);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        });

        this.truckModel = group;
        this.scene.add(this.truckModel);
    }

    updateTruckColors() {
        if (!this.truckModel) return;

        // Update truck appearance based on components
        // This is a simplified version - in a full game, you'd have different models/textures
        this.truckModel.traverse((child) => {
            if (child.isMesh && child.material) {
                // Vary the color slightly based on upgrade level
                const hue = Math.random() * 0.1;
                child.material.color.setHSL(0.1 + hue, 0.6, 0.4);
            }
        });
    }

    render(truck) {
        // Update visual representation based on truck data
        this.updateTruckColors();
        
        // You could add visual indicators for component conditions here
        // For example, smoke effects for high wear, different colors for different upgrade levels
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate the truck slowly
        if (this.truckModel) {
            this.truckModel.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}