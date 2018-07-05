import React from 'react'
import * as THREE from 'three'

class SphereWithNoise extends React.Component {
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
        window.addEventListener('resize', this.onWindowResize);
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
        this.camera.position.z = 5;

        let sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
        let material = new THREE.MeshNormalMaterial();
        this.sphere = new THREE.Mesh(sphere_geometry, material);
        this.scene.add(this.sphere);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor("#222");
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    animate() {
        let time = Date.now()*0.003;
        console.log("time: "+time);
        let k = 3;
        for(let i=0; i<this.sphere.geometry.vertices.length; i++){
            let p = this.sphere.geometry.vertices[i];
            p.normalize().multiplyScalar(1+0.3*Math.random());
        }
        this.sphere.geometry.computeVertexNormals();
        this.sphere.geometry.normalsNeedUpdate = true;
        this.sphere.geometry.verticesNeedUpdate = true;
        this.renderer.render(this.scene, this.camera);
        this.frameId = requestAnimationFrame(this.animate);
    }

    handleResize() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    render() {
        return (
            <div className="canvas-container" ref={(mount) => { this.mount = mount }} />
        )
    }
}

export default SphereWithNoise