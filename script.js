const canvas = document.querySelector("#bg");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07090b, 0.018);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 34);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setClearColor(0x07090b, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);

const starCount = window.innerWidth < 700 ? 650 : 1200;
const starPositions = new Float32Array(starCount * 3);

for (let index = 0; index < starPositions.length; index += 3) {
  starPositions[index] = THREE.MathUtils.randFloatSpread(130);
  starPositions[index + 1] = THREE.MathUtils.randFloatSpread(90);
  starPositions[index + 2] = THREE.MathUtils.randFloatSpread(130) - 20;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xdfe7dc,
  size: 0.12,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.82,
});

const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

const knotGeometry = new THREE.TorusKnotGeometry(7.2, 0.42, 140, 18);
const knotMaterial = new THREE.MeshStandardMaterial({
  color: 0x263127,
  emissive: 0x0b1907,
  metalness: 0.68,
  roughness: 0.34,
});
const knot = new THREE.Mesh(knotGeometry, knotMaterial);
knot.position.set(window.innerWidth < 800 ? 7 : 13, -1.5, -4);
knot.rotation.set(0.2, 0.5, -0.25);
scene.add(knot);

const accentLight = new THREE.PointLight(0xa8ff60, 2.4, 80);
accentLight.position.set(13, 8, 15);
scene.add(accentLight);

const fillLight = new THREE.PointLight(0xbcc9ff, 1.3, 70);
fillLight.position.set(-14, -7, 8);
scene.add(fillLight, new THREE.AmbientLight(0xffffff, 0.18));

let scrollProgress = 0;
let pointerX = 0;
let pointerY = 0;

function updateScrollProgress() {
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  scrollProgress = window.scrollY / scrollable;
}

function handlePointerMove(event) {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  knot.position.x = window.innerWidth < 800 ? 7 : 13;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("pointermove", handlePointerMove, { passive: true });
window.addEventListener("resize", handleResize);
updateScrollProgress();

const clock = new THREE.Clock();

function render() {
  const elapsed = clock.getElapsedTime();
  const motionScale = reduceMotion.matches ? 0 : 1;

  knot.rotation.x = 0.2 + scrollProgress * 1.2 + elapsed * 0.025 * motionScale;
  knot.rotation.y = 0.5 + scrollProgress * 2.4 + elapsed * 0.04 * motionScale;
  starField.rotation.y = scrollProgress * 0.5 + pointerX * 0.04 * motionScale;
  starField.rotation.x = pointerY * 0.025 * motionScale;

  camera.position.x += (pointerX * 1.2 * motionScale - camera.position.x) * 0.025;
  camera.position.y += (-pointerY * 0.8 * motionScale - camera.position.y) * 0.025;
  camera.position.z = 34 - scrollProgress * 5;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
