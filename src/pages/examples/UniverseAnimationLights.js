import React, { Component } from 'react'
import * as THREE from 'three'

const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

class UniverseAnimationLights extends Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.boundResize = this.handleResize.bind(this);
        this.initLights = this.initLights.bind(this);
        this.loadRockTexture = this.loadRockTexture.bind(this);
        this.createRocks = this.createRocks.bind(this);
        //this.Rock = this.Rock.bind(this);
        this.updateCamPosition = this.updateCamPosition.bind(this);
        this.angle = 0;
    }

    componentDidMount() {

        window.addEventListener('resize', debounce(this.boundResize, 16));

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);;
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        //this.renderer.setClearColor('#222');
        this.renderer.setSize(width, height);


        this.initLights();
        this.loadRockTexture();


        this.mount.appendChild(this.renderer.domElement)
        this.start();
    }

    loadRockTexture() {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = true;
        let self = this;
        textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rock-texture.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            self.material = new THREE.MeshLambertMaterial({ map: texture });
            self.createRocks();
        });
    }

    initLights() {
        var light = new THREE.PointLight(0xFFFFFF);
        light.position.set(300, 300, 0);
        this.scene.add(light);

        light = new THREE.PointLight(0xFFFFFF);
        light.position.set(0, 300, 300);
        this.scene.add(light);
    }

    createRocks() {
        this.rocks = [];
        for (var i = 0; i < 100; i++) {
            var r = this.Rock();
            this.rocks.push(r);
        }
    }

    Rock() {
        var size = 10 + Math.random() * 10;
        var geometry = new THREE.IcosahedronGeometry(size, 0);
        var icosahedron = new THREE.Mesh(geometry, this.material);

        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            geometry.vertices[i].x += size * -0.25 + Math.random() * size * 0.5;
            geometry.vertices[i].y += size * -0.25 + Math.random() * size * 0.5;
        }

        // rotate cube
        var variance = 0.01;
        this.vr = {
            x: -variance + Math.random() * variance * 2,
            y: -variance + Math.random() * variance * 2
        }
        var field = 300;
        this.scene.add(icosahedron);
        icosahedron.position.x = -field + Math.random() * field * 2;
        icosahedron.position.y = -field + Math.random() * field * 2;
        icosahedron.position.z = -field + Math.random() * field * 2;

        this.mesh = icosahedron;
    }

    /* rotate() {
        this.mesh.rotation.x += this.vr.x;
        this.mesh.rotation.y += this.vr.y;
    } */

    updateCamPosition() {
        this.angle += 0.005;
        var z = 100 * Math.cos(this.angle);
        var y = 100 * Math.sin(this.angle);

        this.camera.position.z = z;
        this.camera.position.y = y;
        this.camera.rotation.x = z * 0.02;
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

    animate() {

        this.renderer.render(this.scene, this.camera);
        /* for (var i = 0; i < 100; i++) {
            //this.rocks[i].rotate();
        } */

        this.updateCamPosition();
        this.frameId = window.requestAnimationFrame(this.animate)
    }


    handleResize() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        //this.camera.aspect = width / height;
        //this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    render() {
        return (
            <div
                style={{ width: '100%', height: '100vh', }} className="logo"
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default UniverseAnimationLights