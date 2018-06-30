import React from 'react'
import * as THREE from 'three'

class CameraArray extends React.Component {
    constructor(props) {
        super(props);
        this.onWindowResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.init();
        this.start();
    }

    init() {
        window.addEventListener('resize', this.onWindowResize, false);

        let AMOUNT = 6;
        let SIZE = 1 / AMOUNT;
        let ASPECT_RATIO = this.mount.clientWidth / this.mount.clientHeight;

        let cameras = [];
        for(let y=0; y<AMOUNT; y++) {
            for(let x=0; x<AMOUNT; x++) {
                let subcamera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10);
                subcamera.bounds = new THREE.Vector4(x/AMOUNT, y/AMOUNT, SIZE, SIZE);
                subcamera.position.x = (x/AMOUNT)-0.5;
                subcamera.position.y = 0.5-(y/AMOUNT);
                subcamera.position.z = 1.5;
                subcamera.position.multiplyScalar(2);
                subcamera.lookAt(new THREE.Vector3());
                subcamera.updateMatrixWorld();
                cameras.push(subcamera);
            }
        }

        this.camera = new THREE.ArrayCamera(cameras)
        this.camera.position.z =3;
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x222244));

        let light = new THREE.DirectionalLight();
        light.position.set(0.5, 0.5, 1);
        light.castShadow = true;
        light.shadow.camera.zoom = 4;
        this.scene.add(light);

        let geometry = new THREE.PlaneBufferGeometry(100, 100);
        let material = new THREE.MeshPhongMaterial({color: 0x000066});

        let background = new THREE.Mesh(geometry, material);
        background.receiveShadow = true;
        background.position.set(0, 0, -1);
        this.scene.add(background);

        geometry = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32);
        material = new THREE.MeshPhongMaterial({color: 0xff0000});

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.mount.appendChild(this.renderer.domElement);
    }

    handleResize() {
        this.camera.aspect = this.mount.clientWidth/this.mount.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }

    start() {
        if(!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    animate() {
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
        this.frameId = requestAnimationFrame(this.animate)
    }

    render() {
        return (
            <div className="canvas-container" ref={(mount) => {this.mount = mount}}/>
        )
    }
}

export default CameraArray