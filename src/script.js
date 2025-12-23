import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { depth } from 'three/tsl'
import { Color } from 'three/webgpu'
import { Sky } from 'three/addons/objects/Sky.js';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * House
 */
// House Group (walls, roof, door)
const houseSize = {
    width: 4,
    height: 2.5,
    depth: 4
}

const house = new THREE.Group();
// House walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseSize.width, houseSize.height, houseSize.depth),
    new THREE.MeshStandardMaterial()
)
walls.position.y = houseSize.height/2;
house.add(walls);

// House roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.25, houseSize.height/2, 4),
    new THREE.MeshStandardMaterial()
)
roof.position.y = roof.geometry.parameters.height/2 + houseSize.height;
roof.rotation.y = Math.PI/4;
house.add(roof);

// House door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial()
)
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes 
const bushGeometry = new THREE.SphereGeometry();
const bushMaterial = new THREE.MeshStandardMaterial();
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);
bush1.position.set(-0.5, 0, 2);
bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(- 0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);
bush4.scale.setScalar(0.15);
bush4.position.set(- 1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//Add house to the scene
scene.add(house);

//Graves
const numGraves = 30;
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();

for(let i = 0; i < numGraves; i++) {
    //Grave mesh
    const grave = new THREE.Mesh(graveGeometry,graveMaterial);

    const angle = Math.random() * 2*Math.PI;
    const radius = 4 + Math.random()*4;


    //Grave position
    grave.position.x = Math.cos(angle) * radius ;
    grave.position.z = Math.sin(angle) * radius ;
    grave.position.y = Math.random() * 0.4;
    grave.rotation.x = (Math.random() - 0.5)* 0.4;
    grave.rotation.y = (Math.random() - 0.5)* 0.4;
    grave.rotation.z = (Math.random() - 0.5)* 0.4;
    
    graves.add(grave); 
}

scene.add(graves);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20,100,100),
    new THREE.MeshStandardMaterial()
)
floor.rotation.x = - Math.PI/2;
scene.add(floor);

//Textures

const textureLoad = new THREE.TextureLoader();
//Floor
const floorAlpha = textureLoad.load('floor/alpha.jpg');
const floorColorTexture = textureLoad.load('floor/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoad.load('floor/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoad.load('floor/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoad.load('floor/coast_sand_rocks_02_disp_1k.webp')
floor.material.transparent = true;
floor.material.alphaMap = floorAlpha;
floor.material.map = floorColorTexture;
floor.material.map.colorSpace = THREE.SRGBColorSpace;
floor.material.aoMap = floorARMTexture;
floor.material.roughnessMap = floorARMTexture;
floor.material.metalnessMap = floorARMTexture;
floor.material.normalMap = floorNormalTexture;
floor.material.displacementMap = floorDisplacementTexture;
floor.material.displacementScale = 0.3;
floor.material.displacementBias = -0.2;
const floorGui = gui.addFolder( 'Floor' );
floorGui.add(floor.material, 'displacementScale', 0, 1, 0.1).name("Displacement scale");
floorGui.add(floor.material, 'displacementBias', -1, 1, 0.1).name("Displacement bias");

floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWraDisplacement

//Walls

const wallColorTexture = textureLoad.load('wall/castle_brick_broken_06_diff_1k.webp');
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallNormalTexture = textureLoad.load('wall/castle_brick_broken_06_nor_gl_1k.webp');
const wallARMTexture = textureLoad.load('wall/castle_brick_broken_06_arm_1k.webp');

walls.material.map = wallColorTexture;
walls.material.normalMap = wallNormalTexture;
walls.material.aoMap = wallARMTexture;
walls.material.roughnessMap = wallARMTexture;
walls.material.metalnessMap = wallARMTexture;

//Roof

const roofColorTexture = textureLoad.load('roof/clay_roof_tiles_03_diff_1k.webp');
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofNormalTexture = textureLoad.load('roof/clay_roof_tiles_03_nor_gl_1k.webp');
const roofARMTexture = textureLoad.load('roof/clay_roof_tiles_03_arm_1k.webp');

roof.material.map = roofColorTexture;
roof.material.normalMap = roofNormalTexture;
roof.material.aoMap = roofARMTexture;
roof.material.roughnessMap = roofARMTexture;
roof.material.metalnessMap = roofARMTexture;

roofColorTexture.repeat.set(6, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(6, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofARMTexture.repeat.set(6, 1);
roofARMTexture.wrapS = THREE.RepeatWrapping;

//Bushes

const bushColorTexture = textureLoad.load('bushes/leaves_forest_ground_diff_1k.webp');
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushNormalTexture = textureLoad.load('bushes/leaves_forest_ground_nor_gl_1k.webp');
const bushARMTexture = textureLoad.load('bushes/leaves_forest_ground_arm_1k.webp');

bushMaterial.color = new Color('#ccffcc');
bushMaterial.map = bushColorTexture;
bushMaterial.normalMap = bushNormalTexture;
bushMaterial.aoMap = bushARMTexture;
bushMaterial.roughnessMap = bushARMTexture;
bushMaterial.metalnessMap = bushARMTexture;


bushColorTexture.repeat.set(3,1);
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.repeat.set(3,1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.repeat.set(3,1);
bushARMTexture.wrapS = THREE.RepeatWrapping;


bush1.rotation.x = - 0.75;
bush2.rotation.x = - 0.75;
bush3.rotation.x = - 0.75;
bush4.rotation.x = - 0.75;

//Grave

const graveColorTexture = textureLoad.load('grave/plastered_stone_wall_diff_1k.webp');
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveNormalTexture = textureLoad.load('grave/plastered_stone_wall_nor_gl_1k.webp');
const graveARMTexture = textureLoad.load('grave/plastered_stone_wall_arm_1k.webp');

graveMaterial.map = graveColorTexture;
graveMaterial.normalMap = graveNormalTexture;
graveMaterial.aoMap = graveARMTexture;
graveMaterial.roughnessMap = graveARMTexture;
graveMaterial.metalnessMap = graveARMTexture;

graveColorTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
//No need to change the wrapS and wrapT when the repeat values are less than 1

//Door
const doorColorTexture = textureLoad.load('/door/color.webp');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoad.load('/door/alpha.jpg');
const doorAOTexture = textureLoad.load('/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoad.load('/door/height.jpg');
const doorNormalTexture = textureLoad.load('/door/normal.jpg');
const doorMetalnessTexture = textureLoad.load('/door/metalness.jpg');
const doorRoughnessTexture = textureLoad.load('/door/roughness.wepb');

door.material.map = doorColorTexture;
door.material.alphaMap = doorAlphaTexture;
door.material.transparent = true;
door.material.aoMap = doorAOTexture;
door.material.displacementMap = doorHeightTexture;
door.material.displacementScale = 0.1;
door.material.displacementBias = -0.04,
door.material.normalMap = doorNormalTexture;
door.material.metalnessMap = doorMetalnessTexture;
door.material.roughnessMap = doorRoughnessTexture;


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

//Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Shadows
 */

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

 graves.children.forEach(grave => {
    grave.castShadow = true;
    grave.receiveShadow = true;
});

// Mappings
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

// scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    //ghost#1 movement
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.sin(ghost1Angle) * 4;
    ghost1.position.z = Math.cos(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45);

    //ghost#2 movement
    const ghost2Angle = - elapsedTime * 0.38;
    ghost2.position.x = Math.sin(ghost2Angle) * 5;
    ghost2.position.z = Math.cos(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45);

    //ghost#3 movement
    const ghost3Angle = elapsedTime * 0.23;
    ghost3.position.x = Math.cos(ghost3Angle) * 6;
    ghost3.position.z = Math.sin(ghost3Angle) * 6;
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()