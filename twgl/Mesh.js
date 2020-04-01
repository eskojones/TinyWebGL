twgl = Object.assign(twgl, (function () {
    function Mesh (scale, vertices, faces, uvs, shaderProgram) {
        twgl.Object3D.call(this);
        this.buffers = {
            vertices: this.createBuffer(gl.ARRAY_BUFFER, vertices),
            faces: this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, faces),
            uvs: this.createBuffer(gl.ARRAY_BUFFER, uvs)
        };
        this.program = shaderProgram;
        this.vertices = vertices;
        this.faces = faces;
        this.uvs = uvs;
        this.texture = null;
        this.scale = scale.clone();
        this.updateMatrix();
    }

    Mesh.prototype = twgl.objClone(twgl.Object3D.prototype);
    Mesh.prototype.constructor = Mesh;

    Mesh.prototype.createBuffer = function (type, data) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, 
            type === gl.ELEMENT_ARRAY_BUFFER ? 
                new Uint16Array(data)
                :
                new Float32Array(data)
            , gl.STATIC_DRAW
        );
        return buffer;
    }

    Mesh.prototype.enableVertexBuffer = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
        gl.vertexAttribPointer(
            this.program.attribLocations.aVertexPosition,
            3, //numComponents
            gl.FLOAT, 
            false, //normalize
            0, //stride
            0); //offset
        gl.enableVertexAttribArray(this.program.attribLocations.aVertexPosition);
    }

    Mesh.prototype.enableUvBuffer = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uvs);
        gl.vertexAttribPointer(
            this.program.attribLocations.aTextureCoord,
            2, //numComponents
            gl.FLOAT,
            false, //normalize?
            0, //stride
            0); //offset
        gl.enableVertexAttribArray(this.program.attribLocations.aTextureCoord);
    }

    Mesh.prototype.enableFaceBuffer = function () {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
    }

    Mesh.prototype.renderPrepare = function (camera) {
        this.modelViewMatrix.multiply(camera.matrixWorldInverse, this.matrixWorld);
        this.modelViewMatrixArray = this.modelViewMatrix.flatten();
        // let inverseMatrix = Matrix4.makeInvert3x3(this.modelViewMatrix);
        // if (inverseMatrix) {
        //     inverseMatrix.transposeIntoArray(this.normalMatrixArray);
        // }
        
        this.program.use();
        this.enableVertexBuffer();
        this.enableUvBuffer();
        this.enableFaceBuffer();

        gl.uniformMatrix4fv(
            this.program.uniformLocations.uProjectionMatrix,
            false,
            camera.projectionMatrixArray
        );

        gl.uniformMatrix4fv(
            this.program.uniformLocations.uModelViewMatrix,
            false,
            this.modelViewMatrixArray
        );

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.program.uniformLocations.uSampler, 0);
    }

    return {
        Mesh
    }
})());
