class App {
	constructor() {
		this.container = document.querySelector("#webgl-container");

		this.containerW = this.container.offsetWidth;
		this.containerH = this.container.offsetHeight;

		this.mouseX = 0;
		this.mouseY = 0;
		this.windowHalfX = this.containerW / 2;
		this.windowHalfY = this.containerH / 2;

		this.clock = new THREE.Clock();

		this.createScene();
		this.createCamera();
		this.addLight();
		this.getMesh();
		// this.addOrbitControls();
		this.onWindowResize();
		this.render();

		//

		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), {
			passive: true,
		});

		document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), {
			passive: true,
		});

		document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), {
			passive: true,
		});

		window.addEventListener('resize', this.onWindowResize.bind(this), {
			passive: true,
		});
	}

	createScene() {
		this.scene = new THREE.Scene();
    	this.scene.fog = new THREE.Fog(0x0d0d0d, 4000, 6000);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setClearColor(new THREE.Color(0x0d0d0d));
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.containerW, this.containerH);

		this.container.appendChild(this.renderer.domElement);
		this.renderer.domElement.width = this.containerW;
		this.renderer.domElement.height = this.containerH;
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(45, this.containerW / this.containerH, 1, 100000);

		this.camera.position.z = 3500;
	}

	addLight() {
		this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
		this.scene.add(this.ambientLight);

		this.spotLight = new THREE.SpotLight(0xfffacd);
		this.spotLight.position.set(-3000, 3000, 1000);
		this.scene.add(this.spotLight);
    
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		this.directionalLight.position.set(0, 500, 4000);
		this.scene.add(this.directionalLight);
	}

	addParameters() {
	}

	getMesh() {
		// this.addParameters();
    const url = 'https://assets.codepen.io/4292193/map.jpg';

		const urls = [
			url, url, url, url, url, url
		];

		this.mirrors = [];

		const loader = new THREE.CubeTextureLoader();
		const textureCube = loader.load(urls);

		textureCube.mapping = THREE.CubeReflectionMapping;
		// this.scene.background = textureCube;

		this.material = new THREE.MeshPhongMaterial({
			envMap: textureCube,
		});

		for (var i = 0; i < 300; i++) {
			this.geometry = new THREE.CircleGeometry(200, 6);
      //this.geometry = new THREE.CylinderGeometry( 100, 100, 7, 6 );
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			const position = Math.random() * 2000 - 1000;
			this.mesh.position.set(position, position, position);

			// this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = Math.random() * 1.5;

			this.scene.add(this.mesh);

			this.mirrors.push(this.mesh);
		}
	}

	addOrbitControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	onDocumentMouseMove(event) {
		this.mouseX = event.clientX - this.windowHalfX;
		this.mouseY = event.clientY - this.windowHalfY;
	}

	onDocumentTouchStart(event) {
		if (event.touches.length == 1) {
			event.preventDefault();
			this.mouseX = event.touches[0].pageX - this.windowHalfX;
			this.mouseY = event.touches[0].pageY - this.windowHalfY;
		}
	}

	onDocumentTouchMove(event) {
		if (event.touches.length == 1) {
			event.preventDefault();
			this.mouseX = event.touches[0].pageX - this.windowHalfX;
			this.mouseY = event.touches[0].pageY - this.windowHalfY;
		}
	}

	onWindowResize() {
		this.containerW = this.container.offsetWidth;
		this.containerH = this.container.offsetHeight;

		this.camera.aspect = this.containerW / this.containerH;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.containerW, this.containerH);
	}

	update() {
		let time = this.clock.getElapsedTime();
    
    this.camera.position.x = this.mouseX * 0.1;
		this.camera.position.y = -this.mouseY * 0.1;

		for (let i = 0, il = this.mirrors.length; i < il; i++) {
			const mirror = this.mirrors[i];

			mirror.position.x = 2000 * Math.cos(time * 0.1 + i * 3);
			mirror.position.y = 2000 * Math.sin(time * 0.1 + i * 1.1);
			mirror.position.z = 2000 * Math.sin(time * 0.1 + i * 5);

			mirror.rotation.x = time * 0.1 + i;
			mirror.rotation.y = time * 0.1 + i * -1.1;
		}
	}

	render() {
		this.update();

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render.bind(this));
	}
}

new App();