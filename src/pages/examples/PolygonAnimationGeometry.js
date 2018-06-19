import React from 'react'
import * as THREE from 'three'

const debounce = (func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

class PolygonAnimationGeometry extends React.Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.boundResize = this.handleResize.bind(this);
  }

  componentDidMount() {

    window.addEventListener('resize', debounce(this.boundResize, 16));

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );;
    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor('#222');
    renderer.setSize(width, height);

    // add cube
    let geometry = new THREE.IcosahedronGeometry(20, 0);
    let material = new THREE.MeshNormalMaterial();
    let icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // add icosahedron
    geometry = new THREE.OctahedronGeometry(50, 0);
    const color = new THREE.Color('#7833aa');
    material = new THREE.MeshLambertMaterial({color: color.getHex(), wireframe: true});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    camera.position.z = 200;

    // so many lights
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 0, -1, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 0, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 0, -1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( -1, 0, 0 );
    scene.add( light );

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.icosahedron = icosahedron;
    this.mesh = mesh;

    this.mount.appendChild(this.renderer.domElement)
    this.start();
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
    // rotate cube
    this.icosahedron.rotation.x += 0.01;
    this.icosahedron.rotation.y += 0.01;

    // rotate mesh
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
  }

  render() {
    console.log("Animate Cube");
    return (
      <div
        style={{ width: '100%', height: '100vh' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default PolygonAnimationGeometry