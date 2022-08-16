// import * as THREE from 'https://cdn.skypack.dev/three';

// import * as THREE from 'https://cdn.skypack.dev/three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  // alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const loader = new THREE.TextureLoader();

const spaceTexture = loader.load('space.png');
spaceTexture.minFilter = THREE.LinearFilter;
scene.background = spaceTexture;

const geometry = new THREE.TorusKnotGeometry(20, 1, 100, 100);
// const geometry = new THREE.TorusGeometry(20, 1, 100, 100);
// const material = new THREE.MeshStandardMaterial({
//   color: 0xbbbbbb,
//   wireframe: true,
// });
const torusTexture= loader.load('space.jpg');
const material = new THREE.MeshStandardMaterial({map :torusTexture });

const torus = new THREE.Mesh(geometry, material);
torus.position.z = -20;
torus.position.x = 1;
torus.position.y = -2;

scene.add( torus);


// const loader = new THREE.TextureLoader();
// const tex1 = loader.load('crate.gif');
// let boxBuf = new THREE.BoxBufferGeometry(1, 1,1);
// let boxMat = new THREE.MeshBasicMaterial({ map: tex1 });
// const mesh = new THREE.Mesh(boxBuf, boxMat);
 
// mesh.position.z = -4;
// mesh.position.x = 0;
// mesh.position.y = 0;
// scene.add(mesh);


const moonTexture = loader.load("norm.jpg");
const moon = new THREE.Mesh(
  new THREE.IcosahedronBufferGeometry(1, 1),
  new THREE.MeshBasicMaterial({map:moonTexture})
);
moon.position.setX(2);
moon.position.setY(2.5);
moon.position.setZ(10);

scene.add(moon);


const pointLight = new THREE.PointLight(0xaaaaaa);
pointLight.position.set(30, 5, -10);
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(pointLight, ambientLight);


function addStar() {
  const starTexture = loader.load('white.png');
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({map: starTexture})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const boxTexture = loader.load("crate.gif");

const box = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  // new THREE.MeshStandardMaterial({
  // color: 0xbbbbbb,
  // wireframe: true,
  // })
  new THREE.MeshBasicMaterial({map:boxTexture})
);
scene.add(box);
box.position.z = 20;
box.position.x = 1;
box.position.y = -2;

const roopTexture = loader.load('roop.jpg');
const roop = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map:roopTexture})
);

scene.add(roop);


const earthTexture= loader.load('cloud.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  // new THREE.MeshStandardMaterial({
  // color: 0xbbbbbb,
  // wireframe: true,
  // })
  new THREE.MeshBasicMaterial({map:earthTexture})
);
scene.add(earth);

earth.position.z = 15;
earth.position.setX(-10);

roop.position.z = -5;
roop.position.x = 2;


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x += 0.0;
  earth.rotation.y += 0.0;
  earth.rotation.z -= 0.1;

  //roop.position.z = t * -.0009;
  roop.rotation.y += 0.01;
  roop.rotation.z += 0.01;

  box.rotation.x -= 0.01;
  box.rotation.z += 0.01;

  camera.position.z = t * -0.005;
  camera.position.x = t * 0.0003;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  torus.rotation.x += 0.0001;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0;

  moon.rotation.x += 0.005;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.01;


  earth.rotation.z -= 0.01;
  earth.rotation.x += 0.0;
  earth.rotation.y += 0.0;

  //controls.update();

  renderer.render(scene, camera);
}

animate();


