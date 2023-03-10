// import './style.css'
import * as THREE from 'three'
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,-0.1);
let planeIntersect = new THREE.Vector3();

//Texture 
const textureloader = new THREE.TextureLoader();
const matCapTexture = textureloader.load("/MatCap/w2.jpg")
const matCapTexture3 = textureloader.load("/MatCap/clay.jpg")

/**
 * Object
 */
const loader = new GLTFLoader();
// let meshLego;
let sizeLego = 1;
let s = 0.98;
let cell = 32;
let stepX = 1;

const loadedData = await loader.loadAsync('/models/lego.glb');

// const geometryTorus = new THREE.TorusGeometry(10, 3, 16, 100);
 const geometryTorus = new THREE.TorusKnotGeometry(10, 3, 50, 16);
// const geometryTorus = new THREE.BoxGeometry(20,20, 20);
const materialTorus = new THREE.MeshBasicMaterial({ color: 0x008800, side: THREE.DoubleSide });
const torus = new THREE.Mesh(geometryTorus, materialTorus);
torus.geometry.computeBoundingBox();
torus.name = "torus";
scene.add(torus);

// const box = new THREE.Box3();
// box.copy(torus.geometry.boundingBox).applyMatrix4(torus.matrixWorld);

// const helper = new THREE.Box3Helper(box, 0xffff00);
// scene.add(helper);

//box
let groupLego = new THREE.Group();
let dummy = new THREE.Object3D();
// let sizeLego = 2;
// let s = 0.95;
// let cell = 16;

// const geometryLego = new THREE.BoxGeometry(sizeLego * s, sizeLego * s, sizeLego * s);

const geometryLego = loadedData.scene.children[0].geometry; 
geometryLego.rotateX(Math.PI * -0.5);
geometryLego.scale(sizeLego * s, sizeLego * s, sizeLego * s);
const materialLego = new THREE.MeshMatcapMaterial({ color: 0xffffff, matcap: matCapTexture });

let countLego = cell * cell * cell;
let meshLego = new THREE.InstancedMesh(geometryLego, materialLego, countLego);
meshLego.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

const red = new THREE.Color(0xff0000);
const yellow = new THREE.Color(0xffff00);
const green = new THREE.Color(0x00ff00);
const blue = new THREE.Color(0x0000ff);

for (let index = 0; index < countLego; index++) {
    
    const c = Math.random();
    let color;
    if (c <=0.3){
        color = red;
    } else if (c <= 0.6){
        color = yellow;
    } else if (c <= 0.8) {
        color = blue;
    }else{
        color = green;
    }

    meshLego.setColorAt(index, color);
}
meshLego.instanceColor.needsUpdate = true;

groupLego.add(meshLego);

torus.geometry.rotateX(1);

updateLego();
scene.add(groupLego);

///
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
scene.add(plane)

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth, //
    height: window.innerHeight //
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 120
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 2
controls.enableDamping = true

canvas.addEventListener('pointermove', onPointerMove);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const getDelta =  clock.getDelta();
    // Update controls
    controls.update()

    // update the picking ray with the camera and pointer position
    // torus.rotateX(elapsedTime * 0.1)
    updateLego(elapsedTime);
    // }

    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / sizes.width) * 2 - 1;
    pointer.y = - (event.clientY / sizes.height) * 2 + 1;

}

function updateLego(elapsedTime = 0) {
    
    //box
    torus.geometry.rotateY(0.01);
    torus.geometry.rotateX(0.01);
    torus.geometry.computeBoundingBox();

    // const box = new THREE.Box3();
    // box.copy(torus.geometry.boundingBox).applyMatrix4(torus.matrixWorld);

    // const helper = new THREE.Box3Helper(box, 0xffff00);
    // scene.add(helper);

    let boundingX = torus.geometry.boundingBox.min.x;
    let boundingY = torus.geometry.boundingBox.min.y;
    let boundingZ = torus.geometry.boundingBox.min.z;


    let lX = torus.geometry.boundingBox.max.x - torus.geometry.boundingBox.min.x;
    let lY = torus.geometry.boundingBox.max.y - torus.geometry.boundingBox.min.y;
    let lZ = torus.geometry.boundingBox.max.z - torus.geometry.boundingBox.min.z;

    // let cell = 16

    // let stepZ = Math.floor(lZ / cell);
    // let stepX = Math.floor(lX * sizeLego / cell);
    // let stepY = Math.floor(lY / cell);

    // stepX = 1;
    
    let legoBoxIndex = 0;

    for (let i = 0; i < cell; i++) {

        for (let j = 0; j < cell; j++) {

            let origin = new Vector3(boundingX + stepX * i + sizeLego, boundingY + stepX * j + sizeLego, boundingZ + 120);
            let target = new Vector3(0, 0, -1);

            raycaster.set(origin, target);

            const intersects = raycaster.intersectObject(torus);

            if (intersects.length > 0) {

                for (let sprite = 0; sprite < intersects.length; sprite += 2 ) {
                    
                    let lineLength = Math.floor(Math.abs(intersects[sprite].point.z - intersects[sprite+1].point.z));

                    for (let index = 0; index <= lineLength; index = index + stepX) {

                        let positionZ = Math.floor(intersects[sprite].point.z - index) - (Math.floor(intersects[sprite].point.z - index) % sizeLego);
                        dummy.position.set(intersects[sprite].point.x, intersects[sprite].point.y, positionZ);
                        dummy.visible = true;
                        dummy.updateMatrix();

                        meshLego.setMatrixAt(legoBoxIndex, dummy.matrix);
                        legoBoxIndex++;
                    } 
                }

            }
        }        
    }

    for (let index = legoBoxIndex; index < countLego; index++) {
        meshLego.setMatrixAt(index, dummy.matrix);       
    }

    meshLego.instanceMatrix.needsUpdate = true;
    torus.visible = false

}