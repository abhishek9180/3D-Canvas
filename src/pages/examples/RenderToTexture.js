import React from 'react'
import * as THREE from 'three'

class RenderToTexture extends React.Component {
    constructor(props){
        super(props);

        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.animate = this.animate.bind(this);
        this.mouseX = 0;
        this.mouseY = 0;
        this.delta = 0.01;
    }

    componentDidMount() {
        this.fragment_shader_screen = `
			varying vec2 vUv;
			uniform sampler2D tDiffuse;
			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );
			}`;
        
        this.fragment_shader_pass_1 = `varying vec2 vUv;
        uniform float time;
        void main() {
            float r = vUv.x;
            if( vUv.y < 0.5 ) r = 0.0;
            float g = vUv.y;
            if( vUv.x < 0.5 ) g = 0.0;
            gl_FragColor = vec4( r, g, time, 1.0 );
        }`;

        this.vertexShader = `varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`;

        this.init();
        this.start()
        window.addEventListener( 'mousemove', this.onDocumentMouseMove, false);
    }

    init() {

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        
        this.windowHalfX = width / 2; 
        this.windowHalfY = height / 2; 
        this.camera = new THREE.PerspectiveCamera(33, width/height, 1, 10000);
        this.camera.position.z = 100;
        

        this.cameraRTT = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, -10000, 10000);
        this.cameraRTT.position.z = 100;

        this.scene = new THREE.Scene();
        this.sceneRTT = new THREE.Scene();
        this.sceneScreen = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1).normalize();
        this.sceneRTT.add(light);

        light = new THREE.DirectionalLight(0xffaaaa, 1.5);
        light.position.set(0, 0, -1).normalize();
        this.sceneRTT.add(light);

        this.rtTexture = new THREE.WebGLRenderTarget(width, height, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat});
         
        this.material = new THREE.ShaderMaterial({
            uniforms: {time: {value: 0.0}},
            vertexShader: this.vertexShader,
            fragmentShader: this.fragment_shader_pass_1
        });

        let materialScreen = new THREE.ShaderMaterial({
            uniforms: {tDiffuse: {value: this.rtTexture.texture}},
            vertexShader: this.vertexShader,
            fragmentShader: this.fragment_shader_screen,
            depthWrite: false
        });

        let plane = new THREE.PlaneBufferGeometry(width, height);

        let quad = new THREE.Mesh(plane, this.material);
        quad.position.z = -100;
        this.sceneRTT.add(quad);

        let geometry = new THREE.TorusBufferGeometry(100, 25, 15, 30);
        let mat1 = new THREE.MeshPhongMaterial({color: 0x555555, specular: 0xffaa00, shininess: 5});
        let mat2 = new THREE.MeshPhongMaterial({color: 0x550000, specular: 0xff2200, shininess: 5});

        this.zmesh1 = new THREE.Mesh(geometry, mat1);
        this.zmesh1.position.set(0, 0, 100);
        this.zmesh1.scale.set(1.5, 1.5, 1.5);
        this.sceneRTT.add(this.zmesh1);

        this.zmesh2 = new THREE.Mesh(geometry, mat2);
        this.zmesh2.position.set(0, 150, 100);
        this.zmesh2.scale.set(0.75, 0.75, 0.75);
        this.sceneRTT.add(this.zmesh2);

        quad = new THREE.Mesh(plane, materialScreen);
        quad.position.z = -100;
        this.sceneScreen.add(quad);

        let n=5;
        geometry = new THREE.SphereBufferGeometry(10, 64, 32);
        let material2 = new THREE.MeshBasicMaterial({color: 0xffffff, map: this.rtTexture.texture});

        for(let j=0; j<n; j++) {
            for(let i=0; i<n; i++) {
                let mesh = new THREE.Mesh(geometry, material2);
                mesh.position.x = (i - (n - 1) / 2 ) * 20;
                mesh.position.y = (j - (n - j) / 2 ) * 20;
                mesh.position.z = 0;
                mesh.rotation.y = -Math.PI / 2;
                this.scene.add(mesh);
            }
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClear = false;
        this.mount.appendChild(this.renderer.domElement);
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        window.removeEventListener('mousemove', this.onDocumentMouseMove);
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
        let time = Date.now() * 0.0015;
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        if(this.zmesh1 && this.zmesh2) {
            this.zmesh1.rotation.y = -time;
            this.zmesh2.rotation.y = -time + Math.PI / 2;
        }

        if(this.material.uniforms.time.value > 1 || this.material.uniforms.time.value < 0) {
            this.delta *= -1;
        }
        this.material.uniforms.time.value += this.delta;
        this.renderer.clear();
        this.renderer.render(this.sceneRTT, this.cameraRTT, this.rtTexture, true);
        this.renderer.render(this.sceneScreen, this.cameraRTT);
        this.renderer.render(this.scene, this.camera)
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    onDocumentMouseMove(e) {
        this.mouseX = (e.clientX - this.windowHalfX);
        this.mouseY = (e.clientY - this.windowHalfY);
    }

    render() {
        return (
            <div style={{width: '100%', height: '100vh'}} ref={(mount) => {this.mount = mount}} />
        )
    }
}

export default RenderToTexture