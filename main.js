import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

// Sahne, kamera ve render ayarlarını oluştur
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Elmasın üst ve alt kısmı için geometriler
const geometryTop = new THREE.CylinderGeometry(0, 2, 1.5, 8, 1);
const geometryBottom = new THREE.CylinderGeometry(2, 0, 1.5, 8, 1);

// Renkler için ayar (geometryTop ve geometryBottom)
const faceColors = [new THREE.Color(0xd3d3d3), new THREE.Color(0x808080), new THREE.Color(0x404040)];
const colorsTop = [];
const colorsBottom = [];

// Üst kısım için renkler
for (let i = 0; i < geometryTop.attributes.position.count; i++) {
    const randomColor = faceColors[Math.floor(Math.random() * faceColors.length)];
    colorsTop.push(randomColor.r, randomColor.g, randomColor.b);
}
geometryTop.setAttribute('color', new THREE.Float32BufferAttribute(colorsTop, 3));

// Alt kısım için renkler
for (let i = 0; i < geometryBottom.attributes.position.count; i++) {
    const randomColor = faceColors[Math.floor(Math.random() * faceColors.length)];
    colorsBottom.push(randomColor.r, randomColor.g, randomColor.b);
}
geometryBottom.setAttribute('color', new THREE.Float32BufferAttribute(colorsBottom, 3));

// Resmi yüklemek için TextureLoader kullanıyoruz
const textureLoader = new THREE.TextureLoader();
const diamondTexture = textureLoader.load('https://raw.githubusercontent.com/Codley-wq/diamond-3d/main/images/22867b57-b8eb-4ba2-805c-c2ee592df4bc.jpg');

// Alt kısmı için materyal (resim ile)
const bottomMaterialWithTexture = new THREE.MeshStandardMaterial({
    map: diamondTexture,  // Resmi yükle
    side: THREE.DoubleSide,  // Hem ön hem de arka yüzeyde görüntülenmesi için
    roughness: 0.5, // Pürüzlülük
    metalness: 0.3  // Metalik etki
});

// Üst kısmı için malzeme
const topMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true, // Renkleri etkinleştir
    metalness: 0.5,
    roughness: 0.3,
});

// Elmas üst kısmı
const diamondTop = new THREE.Mesh(geometryTop, topMaterial);
diamondTop.position.y = 0.75;

// Elmas alt kısmı (resim ile)
const diamondBottom = new THREE.Mesh(geometryBottom, bottomMaterialWithTexture);
diamondBottom.position.y = -0.75;

// Elması birleştirmek için grup kullanıyoruz
const diamond = new THREE.Group();
diamond.add(diamondTop);
diamond.add(diamondBottom);
scene.add(diamond);

// Sahneye ışık ekle
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ortam ışığı, daha parlak yap
const pointLight = new THREE.PointLight(0xffffff, 5, 100); // Noktasal ışık
pointLight.position.set(10, 10, 10); // Işığın konumu

// Ek ışık kaynağı (alt kısmı aydınlatır)
const additionalPointLight = new THREE.PointLight(0xffffff, 3, 50);
additionalPointLight.position.set(-10, -10, 10);

// Alt kısmı aydınlatacak bir ekstra ışık
const additionalLightForBottom = new THREE.PointLight(0xffffff, 5, 50);
additionalLightForBottom.position.set(0, -2, 0);  // Alt kısmı aydınlatacak şekilde konumlandır

scene.add(ambientLight, pointLight, additionalPointLight, additionalLightForBottom);

// Kamera pozisyonunu ayarla
camera.position.z = 5;

// Fare olayları için değişkenler
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Fare ile nesne sürükleme
window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Elmasın döndürülmesi
        diamond.rotation.y += deltaX * 0.005;
        diamond.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Animasyon fonksiyonu
function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        diamond.rotation.y += 0.01; // Elmasın kendi kendine dönmesi
    }

    renderer.render(scene, camera);
}
animate();

// Pencere boyutları değişirse yeniden ayar yap
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
