twgl = Object.assign(twgl, (function () {
    function Camera (fov, zNear, zFar) {
        twgl.Object3D.call(this);
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.fov = fov;
        this.near = zNear;
        this.far = zFar;
        this.matrixWorldInverse = new Matrix4();
        this.projectionMatrix = Matrix4.makePerspective(fov, aspect, zNear, zFar);
        this.projectionMatrixInverse = new Matrix4();
        this.projectionMatrixArray = [];
        this.updateProjection();
    }

    Camera.prototype = twgl.objClone(twgl.Object3D.prototype);
    Camera.prototype.constructor = Camera;

    Camera.prototype.updateProjection = function () {
        this.updateMatrix();
        this.matrixWorldInverse.getInverse(this.matrixWorld);
    }

    Camera.prototype.renderPrepare = function () {
        this.projectionMatrixArray = this.projectionMatrix.flatten();
    }

    return {
        Camera
    }
})());