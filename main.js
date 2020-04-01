

const main = () => {
    twgl.init('output');
    let grass = twgl.loadTexture('other.png');

    const scene = [];
    const camera = new twgl.Camera(60, 0.1, 1000);
    camera.position.set(0,10,20); 
    camera.rotation.set(twgl.deg2rad * -30,0,0);
    camera.lookAt(new Vector3(0,0,0));
    camera.updateProjection();

    const shader = new twgl.Shader(
        twgl.ShaderLib.main.vertex,
        twgl.ShaderLib.main.fragment
    );

    for (let i = 0; i < 400; i++) {
        let quad = new twgl.Mesh(
            new Vector3(1,1,1), 
            twgl.MeshLib.quad.vertices,
            twgl.MeshLib.quad.faces,
            twgl.MeshLib.quad.uvs,
            shader
        );
        let x = i % 20;
        let y = Math.floor(i / 20);
        quad.position.set(x * 2, 0, y * 2);
        quad.rotation.set(twgl.deg2rad * -90, 0, 0);
        quad.texture = grass;
        quad.updateMatrix();
        scene.push(quad);
    }

    // for (let i = 0; i < 100; i++) {
    //     let cube = new twgl.Mesh(
    //         new Vector3(1,1,1),
    //         twgl.MeshLib.cube.vertices,
    //         twgl.MeshLib.cube.faces,
    //         twgl.MeshLib.cube.uvs,
    //         shader
    //     );
    //     cube.position.set(
    //         (i % 10) * 2.5,//-20 + Math.random() * 40,
    //         0,//-20 + Math.random() * 40,
    //         Math.floor(i / 10) * 2.5//-20 + Math.random() * 40
    //     );
    //     // cube.rotation.set(
    //     //     Math.random() * 180,
    //     //     Math.random() * 180,
    //     //     Math.random() * 180
    //     // );
    //     cube.texture = grass;//twgl.loadTexture(); //random colour
    //     cube.updateMatrix();
    //     scene.push(cube);
    // }

    let keys = {
        forward: 87,
        back: 83,
        left: 65,
        right: 68,
        turnLeft: 81,
        turnRight: 69
    };
    let inputs = {
        forward: false,
        back: false,
        left: false,
        right: false,
        turnLeft: false,
        turnRight: false
    };

    window.onkeydown = function (e) {
        let props = Object.keys(keys);
        for (let i = 0; i < props.length; i++) {
            if (e.keyCode === keys[props[i]]) {
                inputs[props[i]] = true;
                break;
            }
        }
    }

    window.onkeyup = function (e) {
        let props = Object.keys(keys);
        for (let i = 0; i < props.length; i++) {
            if (e.keyCode === keys[props[i]]) {
                inputs[props[i]] = false;
                break;
            }
        }
    }

    const update = () => {
        let props = Object.keys(inputs);
        for (let i = 0; i < props.length; i++) {
            if (inputs[props[i]]) {
                //console.log(props[i]);
                switch(props[i]) {
                    case 'forward':
                        camera.position.addSelf(camera.forward);
                        break;
                    case 'back':
                        camera.position.subSelf(camera.forward);
                        break;
                    case 'left':
                        camera.position.subSelf(camera.right);
                        break;
                    case 'right':
                        camera.position.addSelf(camera.right);
                        break;
                }
            }
        }
    }

    
    const animate = (t) => {
        update();
        // scene.forEach(c => {
        //     c.rotation.x += 0.01;
        //     c.rotation.y += 0.001;
        //     c.rotation.z += 0.02;
        //     c.updateMatrix();
        // });
        twgl.render(camera, scene);
    }

    requestAnimationFrame(function loop(t) {
        requestAnimationFrame(loop);
        animate(t);
    });
};
