import "./style.css";

import * as THREE from "three";
import { Scene } from "three";
import { IcosahedronGeometry } from "three";
import * as dat from "lil-gui";

/**
 * UIデバッグを実装
 */
const gui = new dat.GUI();

//キャンバスの取得
const canvas = document.querySelector(".webgl");

/**
 * 必須の3要素を追加しよう
 */

//シーン
const scene = new THREE.Scene();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.z = 6;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**
 * オブジェクトを作成しよう
 */
const material = new THREE.MeshLambertMaterial({
  color: "#fff099",
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

gui.addColor(material, "color");

//回転用に配置する
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(2, 0, 0);

scene.add(mesh1, mesh2, mesh3, mesh4);

const meshes = [mesh1, mesh2, mesh3, mesh4];

/**
 * パーティクルを追加
 */

//ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#fff",
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * ライトを追加
 */
const directionalLight = new THREE.DirectionalLight("#fff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイールを実装してみよう
let speed = 0;
let rotation = 0;

window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002;
});
const clock = new THREE.Clock();

function rot() {
  rotation += speed;
  speed *= 0.93;
  //ジオメトリ全体を回転させる
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  //   mesh1.position.x = rotation;
  window.requestAnimationFrame(rot);
}
rot();

//カーソルの位置を取得
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
  console.log(cursor);
});

//アニメーション
const animate = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();

  for (const mesh of meshes) {
    //meshを回転させる
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  }

  //カメラの制御をしよう
  camera.position.x += cursor.x * getDeltaTime;
  camera.position.y += -cursor.y * getDeltaTime;

  window.requestAnimationFrame(animate);
};

animate();
