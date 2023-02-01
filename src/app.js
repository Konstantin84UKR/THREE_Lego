// import './style.css'
import * as THREE from 'three'
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,-0.1);
let planeIntersect = new THREE.Vector3();



//Texture 

const textureloader = new THREE.TextureLoader();
const matCapTexture = textureloader.load("/MatCap/green.jpg")
const matCapTexture3 = textureloader.load("/MatCap/clay.jpg")

/**
 * Object
 */
//MeshMatcapMaterial



// const geometryTorus = new THREE.TorusGeometry(3, 1, 16, 100);
const geometryTorus = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const materialTorus = new THREE.MeshBasicMaterial({ color: 0x008800, side: THREE.DoubleSide });
const torus = new THREE.Mesh(geometryTorus, materialTorus);
torus.geometry.computeBoundingBox();
torus.name = "torus";
scene.add(torus);

const box = new THREE.Box3();
box.copy(torus.geometry.boundingBox).applyMatrix4(torus.matrixWorld);

const helper = new THREE.Box3Helper(box, 0xffff00);
scene.add(helper);

//box

let boundingX = torus.geometry.boundingBox.min.x;
let boundingY = torus.geometry.boundingBox.min.y;
let boundingZ = torus.geometry.boundingBox.min.z;


let lX = torus.geometry.boundingBox.max.x - torus.geometry.boundingBox.min.x;
let lY = torus.geometry.boundingBox.max.y - torus.geometry.boundingBox.min.y;
let lZ = torus.geometry.boundingBox.max.z - torus.geometry.boundingBox.min.z;

let cell = 12
let stepX = lX / cell;


// const geometryBox = new THREE.BoxGeometry(1, 1, 1);
// const materialBox = new THREE.MeshBasicMaterial({ color: 0xFF0f00 });
// const cube = new THREE.Mesh(geometryBox, materialBox);
// cube.position.set(boundingX + 0.5, boundingY + 0.5, boundingZ + 0.5);
// scene.add(cube);

// const geometryBox2 = new THREE.BoxGeometry(1, 1, 1);
// const materialBox2 = new THREE.MeshBasicMaterial({ color: 0x000fff });
// const cube2 = new THREE.Mesh(geometryBox2, materialBox2);
// cube2.position.set(boundingX + 0.5, boundingY + 0.5, boundingZ + 2.5);
// scene.add(cube2);

///

let sizeLego = 1;
let stepZ = Math.floor(lZ / sizeLego);

// for (let l = 0; l < lZ; l = l + stepZ) {

    for (let i = 0; i < cell; i++) {

        for (let j = 0; j < cell; j++) {

            let origin = new Vector3(boundingX + stepX * i + sizeLego, boundingY + stepX * j + sizeLego, boundingZ + 50);
            let target = new Vector3(0, 0, -1);


            raycaster.set(origin, target);
        
            const intersects = raycaster.intersectObject(torus);

            if (intersects.length > 0) {
                console.log(intersects[0].object.name);

                for (let index = 0; index < intersects.length; index++) {
            
                const geometryBox = new THREE.BoxGeometry(sizeLego, sizeLego, sizeLego);
                const materialBox = new THREE.MeshBasicMaterial({ color: 0xff88f00 });
                const cube = new THREE.Mesh(geometryBox, materialBox);
                cube.position.set(intersects[index].point.x, intersects[index].point.y, Math.floor(intersects[index].point.z));
                scene.add(cube);
                }

            
            }
        }


    }

    for (let index = 0; index < lZ; index++) {
       
        const geometryBox2 = new THREE.BoxGeometry(sizeLego, sizeLego, sizeLego);
        const materialBox2 = new THREE.MeshBasicMaterial({ color: 0x000fff });
        const cube2 = new THREE.Mesh(geometryBox2, materialBox2);
        cube2.position.set(boundingX, boundingY, boundingZ + index);
        scene.add(cube2);
    }




// }
torus.visible = false


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

    // Update controls
    controls.update()

    // update the picking ray with the camera and pointer position
    // torus.rotateX(elapsedTime * 0.01)
    
    // for (let i = 0; i < cell; i++) {

    //     for (let j = 0; j < cell; j++) {

    //         let origin = new Vector3(boundingX + step * i + 0.5, boundingY + step * j + 0.5, boundingZ + 6);
    //         let target = new Vector3(0, 0, -1);


    //         raycaster.set(origin, target);
    //         // raycaster.set(new Vector3(boundingX + step * i + 0.5, boundingY + step * j + 0.5, boundingZ + 6), new Vector3(boundingX + step * i + 0.5, boundingY + step * j + 0.5, -1));


    //         const intersects = raycaster.intersectObject(torus);

    //         if (intersects.length > 0) {
    //             console.log(intersects[0].object.name);

    //             // const geometryBox = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    //             // const materialBox = new THREE.MeshBasicMaterial({ color: 0xff88f00 });
    //             // const cube = new THREE.Mesh(geometryBox, materialBox);
    //             // cube.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    //             // scene.add(cube);
    //         }

    //         // const geometryBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    //         // const materialBox = new THREE.MeshBasicMaterial({ color: 0xFF0f00 });
    //         // const cube = new THREE.Mesh(geometryBox, materialBox);
    //         // cube.position.set(target.x, target.y, target.z);
    //         // scene.add(cube);

    //         // const geometryBox2 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    //         // const materialBox2 = new THREE.MeshBasicMaterial({ color: 0x000fff });
    //         // const cube2 = new THREE.Mesh(geometryBox2, materialBox2);
    //         // cube2.position.set(origin.x, origin.y, origin.z);
    //         // scene.add(cube2);

    //     }
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