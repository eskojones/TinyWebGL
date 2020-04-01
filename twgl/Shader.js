twgl = Object.assign(twgl, (function () {
    const ShaderLib = {
        'main': {
            vertex: `
                attribute vec3 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
                varying highp vec2 vTextureCoord;

                void main(void) {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
                    vTextureCoord = aTextureCoord;
                }
            `,
            fragment: `
                varying highp vec2 vTextureCoord;
                uniform sampler2D uSampler;
                void main(void) {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                }
            `
        }
    };


    function Shader (vertexSrc, fragmentSrc) {
        const vertexShader = twgl.makeShader(gl.VERTEX_SHADER, vertexSrc);
        const fragmentShader = twgl.makeShader(gl.FRAGMENT_SHADER, fragmentSrc);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn(gl.getProgramInfoLog(program));
            throw 'Unable to link program';
        }
        this.program = program;
        this.attribLocations = { };
        this.uniformLocations = { };

        const getShaderVars = (source) => {
            let out = [];
            source.split('\n').forEach(line => {
                let words = line.split(' ');
                let attribIdx = words.indexOf('attribute');
                let uniformIdx = words.indexOf('uniform');
                if (attribIdx >= 0) {
                    let name = words[attribIdx+2].substr(0, words[attribIdx+2].length - 1);
                    console.log(`attribute ${name}`);
                    out.push({ type: 'attribute', name });
                } else if (uniformIdx >= 0) {
                    let name = words[uniformIdx+2].substr(0, words[uniformIdx+2].length - 1);
                    console.log(`uniform ${name}`);
                    out.push({ type: 'uniform', name });
                }
            });
            return out;
        };

        let shaderVars = getShaderVars(vertexSrc).concat(getShaderVars(fragmentSrc));
        shaderVars.forEach(v => {
            if (v.type == 'attribute') {
                this.attribLocations[v.name] = gl.getAttribLocation(program, v.name);
            } else if (v.type == 'uniform') {
                this.uniformLocations[v.name] = gl.getUniformLocation(program, v.name);
            }
        });
    }

    Shader.prototype.constructor = Shader;
    Shader.prototype.use = function () {
        gl.useProgram(this.program);
    }
    
    return {
        ShaderLib,
        Shader
    }

})());
