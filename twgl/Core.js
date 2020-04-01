var twgl = (function () {
    const deg2rad = 0.0174533, cos = Math.cos, sin = Math.sin;
    const objClone = (fromObject) => {
        return Object.defineProperties({}, Object.getOwnPropertyDescriptors(fromObject));
    }


    const init = (elementId) => {
        const canvas = document.getElementById(elementId);
        window.gl = canvas.getContext('webgl');
        if (window.gl === null) throw 'WebGL not supported';
        return window.gl;
    }


    const makeShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            console.warn('Shader compile failed');
            console.log(source);
            throw 'Shader compile failed';
        }
        return shader;
    }

    const clear = (r = 0, g = 0, b = 0, clearDepth = true) => {
        gl.clearColor(r, g, b, 1.0);
        gl.clearDepth(clearDepth ? 1.0 : 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(clearDepth ? (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) : gl.COLOR_BUFFER_BIT);
    }

    const render = (camera, scene = []) => {
        clear();
        camera.renderPrepare();
        scene.forEach(mesh => {
            mesh.renderPrepare(camera);
            gl.drawElements(gl.TRIANGLES, mesh.vertices.length * 0.5, gl.UNSIGNED_SHORT, 0);
        });
    }


    const loadTexture = (url, callback = null) => {
        //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      width, height, border, srcFormat, srcType,
                      pixel);

        const image = new Image();
        image.isLoaded = false;
        texture.sourceImage = image;
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                          srcFormat, srcType, image);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if ((image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
                // Yes, it's a power of 2. Generate mips.
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            image.isLoaded = true;
            if (callback !== null) callback(url, texture);
        };
        image.src = url;
        return texture;
    }


    return {
        objClone,
        deg2rad,
        init,
        makeShader,
        clear,
        render,
        loadTexture
    };
})();
