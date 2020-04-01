

const main = () => {
    twgl.init('output');
    let tex = twgl.loadTexture('other.png');

    const scene = [];
    const camera = new twgl.Camera(60, 0.1, 1000);
    camera.position.set(-10,10,20); //slightly above ground, looking straight down
    //camera.rotation.set(-90,0,0);
    camera.lookAt(new Vector3(0,0,0));
    camera.updateProjection();

    const shader = new twgl.Shader(
        twgl.ShaderLib.main.vertex,
        twgl.ShaderLib.main.fragment
    );

    // for (let i = 0; i < 4; i++) {
    //     let quad = new twgl.Mesh(
    //         new Vector3(2,2,2), 
    //         twgl.MeshLib.quad.vertices,
    //         twgl.MeshLib.quad.faces,
    //         twgl.MeshLib.quad.uvs,
    //         shader
    //     );
    //     let x = i % 2;
    //     let y = Math.floor(i / 2);
    //     quad.position.set(x * 2, 0, y * 2);
    //     quad.rotation.set(-90, 0, 0);
    //     quad.texture = tex;
    //     quad.updateMatrix();
    //     scene.push(quad);
    // }

    for (let i = 0; i < 2000; i++) {
        let cube = new twgl.Mesh(
            new Vector3(1,1,1),
            twgl.MeshLib.cube.vertices,
            twgl.MeshLib.cube.faces,
            twgl.MeshLib.cube.uvs,
            shader
        );
        cube.position.set(
            -20 + Math.random() * 40,
            -20 + Math.random() * 40,
            -20 + Math.random() * 40
        );
        cube.rotation.set(
            Math.random() * 180,
            Math.random() * 180,
            Math.random() * 180
        );
        cube.texture = tex;
        cube.updateMatrix();
        scene.push(cube);
    }

    window.onkeypress = function (e) {
        console.log(e.which);
        if (e.which == 119) camera.position.addSelf(camera.forward);
        else if (e.which == 115) camera.position.subSelf(camera.forward);
        else if (e.which == 97) camera.position.x -= 0.25;
        else if (e.which == 100) camera.position.x += 0.25;
        else if (e.which == 113) camera.rotation.y += 0.1;
        else if (e.which == 101) camera.rotation.y -= 0.1;
        camera.updateProjection();
    }

    
    const animate = (t) => {
        scene.forEach(c => {
            c.rotation.x += 0.01;
            c.rotation.y += 0.001;
            c.rotation.z += 0.02;
            c.updateMatrix();
        });
        twgl.render(camera, scene);
    }

    requestAnimationFrame(function loop(t) {
        requestAnimationFrame(loop);
        animate(t);
    });
};
