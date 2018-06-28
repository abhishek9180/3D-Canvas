import React, { Component } from 'react'
import * as THREE from 'three'

const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

class AppLogo extends Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.boundResize = this.handleResize.bind(this);
        this.initLights = this.initLights.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
        this.createScene = this.createScene.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    }

    componentDidMount() {

        window.addEventListener('resize', debounce(this.boundResize, 16));
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;

        this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1200;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060708);

        this.initLights();
        this.loadTexture();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;
        //
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.start();
    }

    loadTexture() {
        let mapHeight = new THREE.TextureLoader().load("./models/json/leeperrysmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg");
        let material = new THREE.MeshPhongMaterial({
            color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpMap: mapHeight,
            bumpScale: 12
        });
        var loader = new THREE.JSONLoader();
        let self = this;
        loader.load("./models/json/leeperrysmith/LeePerrySmith.json", 
            function (geometry) { self.createScene(geometry, 100, material) },
            // onError callback
            function( err ) {
                console.log( 'An error happened: ' + JSON.stringify(err) );
            }
        );
    }

    initLights() {
        this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
        let spotLight = new THREE.SpotLight(0xffffbb, 2);
        spotLight.position.set(0.5, 0, 1);
        spotLight.position.multiplyScalar(700);
        this.scene.add(spotLight);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.near = 200;
        spotLight.shadow.camera.far = 1500;
        spotLight.shadow.camera.fov = 40;
        spotLight.shadow.bias = -0.005;
    }


    createScene(geometry, scale, material) {
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = - 50;
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }


    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        window.removeEventListener('scroll', debounce(this.boundResize, 16));
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY);
    }

    animate() {
        this.targetX = this.mouseX * .001;
        this.targetY = this.mouseY * .001;
        if (this.mesh) {
            this.mesh.rotation.y += 0.05 * (this.targetX - this.mesh.rotation.y);
            this.mesh.rotation.x += 0.05 * (this.targetY - this.mesh.rotation.x);
        }
        this.renderer.render(this.scene, this.camera);
        this.frameId = window.requestAnimationFrame(this.animate)
    }


    handleResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render() {
        return (
            <div ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default AppLogo