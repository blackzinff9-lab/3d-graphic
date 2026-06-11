import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Configuração Básica (Cena, Câmera, Renderizador)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Melhora o realismo das cores
renderer.toneMappingExposure = 1.2;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);

// 2. Iluminação Realista
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

// 3. Carregando o Modelo 3D (Substitua pelo seu arquivo .glb)
const loader = new GLTFLoader();
let personagem, ossoCabeca, ossoBracoEsq, ossoBracoDir, ossoOmbroEsq, ossoOmbroDir;

// NOTA: Para testar sem modelo, comente a função load abaixo e use as formas básicas se quiser, 
// mas para funcionar precisa de um arquivo 'public/boneco.glb' com esqueleto.
loader.load('public/boneco.glb', (gltf) => {
    personagem = gltf.scene;
    scene.add(personagem);

    // Encontrando os ossos pelo nome (Os nomes dependem de como foi feito no Blender)
    personagem.traverse((child) => {
        if (child.isBone) {
            if (child.name.includes('Head')) ossoCabeca = child;
            if (child.name.includes('UpperArm_L')) ossoBracoEsq = child;
            if (child.name.includes('UpperArm_R')) ossoBracoDir = child;
            if (child.name.includes('Shoulder_L')) ossoOmbroEsq = child;
            if (child.name.includes('Shoulder_R')) ossoOmbroDir = child;
        }
    });
}, undefined, (error) => console.error('Erro ao carregar o modelo', error));

// 4. Conectando a UI com os Ossos (Escala)
document.getElementById('largura-ombros').addEventListener('input', (e) => {
    const valor = parseFloat(e.target.value);
    if(ossoOmbroEsq) ossoOmbroEsq.scale.set(valor, 1, 1);
    if(ossoOmbroDir) ossoOmbroDir.scale.set(valor, 1, 1);
});

document.getElementById('espessura-bracos').addEventListener('input', (e) => {
    const valor = parseFloat(e.target.value);
    // Escalando X e Z altera a espessura sem esticar o braço (Y)
    if(ossoBracoEsq) ossoBracoEsq.scale.set(valor, 1, valor);
    if(ossoBracoDir) ossoBracoDir.scale.set(valor, 1, valor);
});

document.getElementById('tamanho-cabeca').addEventListener('input', (e) => {
    const valor = parseFloat(e.target.value);
    if(ossoCabeca) ossoCabeca.scale.set(valor, valor, valor);
});

// 5. Loop de Animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsividade
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
