import * as THREE from "https://cdn.skypack.dev/three@0.139.1/build/three.module";
import { GUI } from "https://cdn.skypack.dev/lil-gui@0.16.1";

const container = document.querySelector(".container");
const canvasEl = document.querySelector("#canvas");

let renderer, scene, camera, clock, material;
let pointer = new THREE.Vector2(0.5, 0.5);
let targetPointer = new THREE.Vector2(0.5, 0.5);

const params = {
	coloring: 0.93,
	speed: 0.1
};

initScene();
createControls();
window.addEventListener("resize", updateSceneSize);

window.addEventListener("mousemove", (e) => {
	updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
	updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});
function updateMousePosition(eX, eY) {
	targetPointer.x = eX / window.innerWidth;
	targetPointer.y = 1 - eY / window.innerHeight;
}

function initScene() {
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		canvas: canvasEl
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
	clock = new THREE.Clock();

	material = new THREE.ShaderMaterial({
		uniforms: {
			u_point: { type: "v2", value: pointer },
			u_resolution: { type: "v2", value: new THREE.Vector2(0, 0) },
			u_time: { type: "f", value: 0 },
			u_ratio: { type: "f", value: window.innerWidth / window.innerHeight },
			u_width: { type: "f", value: window.innerWidth },

			u_strength: { type: "f", value: params.strength },
			u_coloring: { type: "f", value: params.coloring },
			u_speed: { type: "f", value: params.speed }
		},
		vertexShader: document.getElementById("vertexShader").textContent,
		fragmentShader: document.getElementById("fragmentShader").textContent
	});
	const planeGeometry = new THREE.PlaneGeometry(2, 2);
	scene.add(new THREE.Mesh(planeGeometry, material));

	updateSceneSize();
	render();
}

function render() {
	pointer.x += (targetPointer.x - pointer.x) * 0.1;
	pointer.y += (targetPointer.y - pointer.y) * 0.1;
	material.uniforms.u_point.value = pointer;

	material.uniforms.u_time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function updateSceneSize() {
	material.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
	material.uniforms.u_width.value = window.innerWidth;
	renderer.setSize(container.clientWidth, container.clientHeight);
}

function createControls() {
	const gui = new GUI();
	gui.add(params, "coloring", 0, 1, 0.01).onChange((v) => {
		material.uniforms.u_coloring.value = v;
	});
	gui.add(params, "speed", 0, 0.8, 0.01).onChange((v) => {
		material.uniforms.u_speed.value = v;
	});
}
