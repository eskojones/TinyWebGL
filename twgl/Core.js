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
        const program = gl.createShader(type);
        gl.shaderSource(program, source);
        gl.compileShader(program);
        if (!gl.getShaderParameter(program, gl.COMPILE_STATUS)) {
            gl.deleteShader(program);
            console.warn('Shader compile failed');
            console.log(source);
            throw 'Shader compile failed';
        }
        return program;
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
        camera.updateProjection();
        camera.renderPrepare();
        scene.forEach(mesh => {
            mesh.renderPrepare(camera);
            gl.drawElements(gl.TRIANGLES, mesh.vertices.length * 0.5, gl.UNSIGNED_SHORT, 0);
        });
    }


    const loadTexture = (url = null, callback = null) => {
        //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
        const texture = {
            glTexture: gl.createTexture(),
            level: 0,
            width: 1,
            height: 1,
            border: 0,
            internalFormat: gl.RGBA,
            srcFormat: gl.RGBA,
            srcType: gl.UNSIGNED_BYTE,
            srcImage: new Image(),
            loaded: false
        };
        gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
        
        let pixel = null;

        if (url instanceof Array) {
            pixel = new Uint8Array(url);
        } else if (url instanceof String) {
            pixel = new Uint8Array([ 0, 0, 0, 255 ]);
        } else {
            pixel = new Uint8Array([
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                255
            ]);
        }

        gl.texImage2D(
            gl.TEXTURE_2D, 
            texture.level, 
            texture.internalFormat,
            texture.width, texture.height, texture.border, 
            texture.srcFormat, texture.srcType,
            pixel
        );

        if (url instanceof Array || url === null) return texture;

        texture.srcImage.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
            gl.texImage2D(
                gl.TEXTURE_2D, 
                texture.level, 
                texture.internalFormat,
                texture.srcFormat, 
                texture.srcType, 
                texture.srcImage
            );

            texture.width = texture.srcImage.width;
            texture.height = texture.srcImage.height;

            if ((texture.width & (texture.width - 1)) == 0 && (texture.height & (texture.height - 1)) == 0) {
                gl.generateMipmap(gl.TEXTURE_2D); //power of 2
            } else {
                //not power of 2
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            texture.loaded = true;
            texture.srcImage = null; //dereference unneeded Image instance
            if (callback !== null) callback(texture);
        };
        texture.srcImage.src = url;
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
