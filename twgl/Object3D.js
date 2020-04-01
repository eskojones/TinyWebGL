twgl = Object.assign(twgl, (function () {
    function Object3D () {
        this.worldUp = new Vector3(0,1,0);
        this.up = new Vector3(0,1,0);
        this.forward = new Vector3(0,0,-1);
        this.right = new Vector3(1,0,0);

        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1,1,1);

        this.matrix = new Matrix4();
        this.matrixWorld = new Matrix4();
        this.matrixRotationWorld = new Matrix4();
        this.modelViewMatrix = new Matrix4();
        this.modelViewMatrixArray = [];
        this.normalMatrixArray = [];

        this.updateMatrix();
    }

    Object3D.prototype.constructor = Object3D;

    Object3D.prototype.updateMatrix = function () {
        this.matrix.setPosition(this.position);
        this.matrix.setRotationFromEuler(this.rotation);
        if (this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1) {
            this.matrix.scale(this.scale);
            //TODO: Adjust AABBs here
        }
        this.matrixWorld.copy(this.matrix);
        this.forward.set(0,0,-1);
        this.matrix.rotateAxis(this.forward);
        this.forward.normalize();
        this.right.cross(this.forward, this.worldUp).normalize();
        this.up.cross(this.right, this.forward).normalize();
        // //forward,up,right
        // let v = new Vector3(0,0,-1);
        // this.matrix.rotateAxis(v);
        // this.forward.copy(v);
        // v.set(1,0,0);
        // this.matrix.rotateAxis(v);
        // this.right.copy(v);
        // v.set(0,1,0);
        // this.matrix.rotateAxis(v);
        // this.up.copy(v);
    }

    Object3D.prototype.lookAt = function (vector) {
        this.matrix.lookAt(this.position, vector, this.up);
        this.setRotationFromMatrix();
    }

    Object3D.prototype.setRotationFromMatrix = function () {
        this.rotation.setRotationFromMatrix(this.matrix);
    }

	Object3D.prototype.translate = function (distance, axis) {
        this.matrix.rotateAxis(axis);
        this.position.addSelf(axis.multiplyScalar(distance));
	}

    return {
        Object3D
    }
})());

