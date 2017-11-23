function createBaseScene() {

    let camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.set( 0, 0, 0.4 );

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    document.body.appendChild( renderer.domElement );

    let scene = new THREE.Scene();

    // Registers global events
    window.addEventListener( `resize`, function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );

    return { camera, renderer, scene };

}
