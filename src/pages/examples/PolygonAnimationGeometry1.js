import React from 'react'
import * as THREE from 'three'

const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

class PolygonAnimationGeometry1 extends React.Component {
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
    const camera = new THREE.PerspectiveCamera(30, width / height , 0.1, 1000);;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor('#222');
    renderer.setSize(width, height);

    // add cube
    let geometry = new THREE.IcosahedronGeometry(20, 0);
    let material = new THREE.MeshNormalMaterial();
    let icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    camera.position.z = 200;

    // so many lights
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, -1, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 0, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 0, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, -1);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 0);
    scene.add(light);

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.icosahedron = icosahedron;

    this.mount.appendChild(this.renderer.domElement)
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    window.removeEventListener('resize', debounce(this.boundResize, 16));
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

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    console.log("width: " + width);
    this.renderer.setSize(width, height);
  }

  render() {
    return (
      <div className="canvas-container" ref={(mount) => { this.mount = mount }}/>
    )
  }
}

export default PolygonAnimationGeometry1