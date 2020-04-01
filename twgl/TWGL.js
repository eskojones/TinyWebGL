
const loadDependencies = (deps, callback = null, index = 0) => {
    if (index == deps.length) {
        console.log(`Finished loading ${index} scripts.`);
        return callback !== null ? callback() : null;
    }
    let body = document.getElementsByTagName('body')[0];
    let src = deps[index];
    console.log(`Loading script '${src}'`);
    newElement('script', [], { 'src': src }, body).addEventListener('load', () => loadDependencies(deps, callback, index + 1));
};

const newElement = (tag, classes = [], attributes = {}, parent = null, children = null) => {
    let el = document.createElement(tag);
    classes.forEach(className => el.classList.add(className));
    Object.keys(attributes).forEach(attribName => el.setAttribute(attribName, attributes[attribName]));
    if (parent !== null) parent.appendChild(el);
    if (children !== null) {
        if (typeof children == 'string') el.innerHTML = children;
        else if (typeof children != 'string' && children.hasOwnProperty('length')) children.forEach(child => el.appendChild(child));
        else el.appendChild(children);
    }
    return el;
};

window.onload = function () {
    loadDependencies([ 
        'twgl/Vector3.js', 
        'twgl/Matrix3.js', 
        'twgl/Matrix4.js', 
        'twgl/Core.js',
        'twgl/Object3D.js',
        'twgl/Mesh.js',
        'twgl/Camera.js',
        'twgl/MeshLib.js',
        'twgl/Shader.js'
    ], () => {
        if (main) main();
    });
}
