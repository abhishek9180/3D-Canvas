import React, { Component } from 'react'
import * as THREE from 'three'

const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

class TextAnimationLights extends Component {
    constructor(props) {
        super(props)

        this.firstLetter = true;
		this.text = "Canvas";
		this.height = 20;
		this.size = 70;
		this.hover = 30;
		this.curveSegments = 4;
        this.bevelThickness = 2;
        this.bevelSize = 1.5;
        this.bevelSegments = 3;
        this.bevelEnabled = true;
		this.font = undefined;
		this.mirror = true;
			
		this.targetRotation = 0;
		this.targetRotationOnMouseDown = 0;
		this.mouseX = 0;
		this.mouseXOnMouseDown = 0;
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
        this.isFirstTimeLoaded = true;

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.boundResize = this.handleResize.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this);
        this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this); 
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this); 
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this); 
        this.onDocumentMouseOut = this.onDocumentMouseOut.bind(this); 
    }

    componentDidMount() {

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 1500);
        this.camera.position.set(0, 400, 700);
        this.cameraTarget = new THREE.Vector3(0, 150, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
        
        // LIGHTS
		let dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
		dirLight.position.set( 0, 0, 1 ).normalize();
		this.scene.add( dirLight );
		let pointLight = new THREE.PointLight( 0xffffff, 1.5 );
		pointLight.position.set( 0, 100, 90 );
        this.scene.add( pointLight );
        
		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		//hex = this.decimalToHex( pointLight.color.getHex() );
		
		this.materials = [
			new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
			new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
		];
		this.group = new THREE.Group();
		this.group.position.y = 100;
		this.scene.add( this.group );
		this.loadFont();
                
        let plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 10000, 10000 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
		);
		plane.position.y = 100;
		plane.rotation.x = - Math.PI / 2;
        this.scene.add( plane );
        
		// RENDERER
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );
		this.mount.appendChild(this.renderer.domElement)
				
		// EVENTS
		document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
		document.addEventListener( 'touchstart', this.onDocumentTouchStart, {passive: false} );
		document.addEventListener( 'touchmove', this.onDocumentTouchMove, {passive: false} );
		document.addEventListener( 'keypress', this.onDocumentKeyPress, false );
        document.addEventListener( 'keydown', this.onDocumentKeyDown, false );
        window.addEventListener('resize', debounce(this.boundResize, 16));

        this.start();
    }

    decimalToHex( d ) {
        let hex = Number( d ).toString( 16 );
        hex = "000000".substr( 0, 6 - hex.length ) + hex;
        return hex.toUpperCase();
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        window.removeEventListener('scroll', debounce(this.boundResize, 16));
        document.removeEventListener( 'mousedown', this.onDocumentMouseDown );
		document.removeEventListener( 'touchstart', this.onDocumentTouchStart );
		document.removeEventListener( 'touchmove', this.onDocumentTouchMove );
		document.removeEventListener( 'keypress', this.onDocumentKeyPress );
        document.removeEventListener( 'keydown', this.onDocumentKeyDown );
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    onDocumentKeyDown( event ) {
        if ( this.firstLetter ) {
            this.firstLetter = false;
            this.text = "";
        }
        let keyCode = event.keyCode;
        // backspace
        if ( keyCode === 8 ) {
            event.preventDefault();
            this.text = this.text.substring( 0, this.text.length - 1 );
            this.refreshText();
            return false;
        }
    }

    onDocumentKeyPress( event ) {
        let keyCode = event.which;
        // backspace
        if ( keyCode === 8 ) {
            event.preventDefault();
        } else {
            let ch = String.fromCharCode( keyCode );
            this.text += ch;
            this.refreshText();
        }
    }

    loadFont() {
        let loader = new THREE.FontLoader();
        let self = this;
        loader.load( '../fonts/optimer_bold.typeface.json', function ( response ) {
            self.font = response;
            self.refreshText();
        } );
    }
    createText() {
        this.textGeo = new THREE.TextGeometry( this.text, {
            font: this.font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelEnabled: this.bevelEnabled
        });
        this.textGeo.computeBoundingBox();
        this.textGeo.computeVertexNormals();
        
        let centerOffset = -0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );
        this.textMesh1 = new THREE.Mesh( this.textGeo, this.materials );
        this.textMesh1.position.x = centerOffset;
        this.textMesh1.position.y = this.hover;
        this.textMesh1.position.z = 0;
        this.textMesh1.rotation.x = 0;
        this.textMesh1.rotation.y = Math.PI * 2;
        this.group.add( this.textMesh1 );
        if ( this.mirror ) {
            this.textMesh2 = new THREE.Mesh( this.textGeo, this.materials );
            this.textMesh2.position.x = centerOffset;
            this.textMesh2.position.y = -this.hover;
            this.textMesh2.position.z = this.height;
            this.textMesh2.rotation.x = Math.PI;
            this.textMesh2.rotation.y = Math.PI * 2;
            this.group.add( this.textMesh2 );
        }
    }
    
    refreshText() {
        this.group.remove( this.textMesh1 );
        if ( this.mirror ) this.group.remove( this.textMesh2 );
        if ( !this.text ) return;
        this.createText();
    }
    
    onDocumentMouseDown( event ) {
        event.preventDefault();
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', this.onDocumentMouseOut, false );
        this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
        this.targetRotationOnMouseDown = this.targetRotation;
    }
    
    onDocumentMouseMove( event ) {
        this.mouseX = event.clientX - this.windowHalfX;
        this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.02;
    }
    
    onDocumentMouseUp( event ) {
        document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
    }

    onDocumentMouseOut( event ) {
        document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
    }
    
    onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            this.mouseXOnMouseDown = event.touches[ 0 ].pageX - this.windowHalfX;
            this.targetRotationOnMouseDown = this.targetRotation;
        }
    }
    
    onDocumentTouchMove( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
            this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.05;
        }
    }


    stop() {
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        if(this.isFirstTimeLoaded){
            this.targetRotation = 300 * 0.02;
            this.isFirstTimeLoaded = false;
        }
        
        this.group.rotation.y += ( this.targetRotation - this.group.rotation.y ) * 0.05;
		this.camera.lookAt( this.cameraTarget );
		this.renderer.clear();
		this.renderer.render( this.scene, this.camera );
        
        this.frameId = window.requestAnimationFrame(this.animate)
    }


    handleResize() {
        this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
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

export default TextAnimationLights