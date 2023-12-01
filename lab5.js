let gl;
let shaderProgram;

let alpha, beta, gamma, xinc, yinc, sx, sy, mtx, mty, msx, msy;
let matX, matY, matZ, tranX, tranY, scale_X, scale_Y;
let matXUni, matYUni, matZUni, tranXUni, tranYUni, scaleXUni, scaleYUni;

let inputs = {};

let textureImage;

function init() {
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );
    
    gl.clearColor( 0.0, 0.5, 0.0, 1.0 );

    alpha = .0;
    beta = .0;
    gamma = .0;
    xinc = .0;
    yinc = .0;
    sx = 1.0;
    sy = 1.0;
    mtx = 1.0;
    mty = 1.0;
    msx = 1.0;
    msy = 1.0;

    matX = [1,
            .0,
            .0,
            .0,
            .0,
            Math.cos(alpha),
            -Math.sin(alpha),
            .0,
            .0,
            Math.sin(alpha),
            Math.cos(alpha),
            .0,
            .0,
            .0,
            .0,
            1.0];

    matY = [Math.cos(beta),
            .0,
            -Math.sin(beta),
            .0,
            .0,
            1.0,
            .0,
            .0,
            Math.sin(beta),
            .0,
            Math.cos(beta),
            .0,
            .0,
            .0,
            .0,
            1.0];

    matZ = [Math.cos(gamma),
            Math.sin(gamma),
            .0,
            .0,
            -Math.sin(gamma),
            Math.cos(gamma),
            .0,
            .0,
            .0,
            .0,
            1.0,
            .0,
            .0,
            .0,
            .0,
            1.0];

    tranX = [1.0, .0, .0, .0,
             .0, 1.0, .0, .0,
             .0, .0, 1.0, .0,
            xinc, .0, .0, 1.0];

    tranY = [1.0, .0, .0, .0,
             .0, 1.0, .0, .0,
             .0, .0, 1.0, .0,
             .0, yinc, .0, 1.0];

    scale_X = [sx, .0, .0, .0,
              .0, 1.0, .0, .0,
              .0, .0, 1.0, .0,
              .0, .0, .0, 1.0];

    scale_Y = [1.0, .0, .0, .0,
              .0, sy, .0, .0,
              .0, .0, 1.0, .0,
              .0, .0, 0, 1.0];


    shaderProgram = initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( shaderProgram );

    matXUni = gl.getUniformLocation(shaderProgram, "matX");
    matYUni = gl.getUniformLocation(shaderProgram, "matY");
    matZUni = gl.getUniformLocation(shaderProgram, "matZ");
    tranXUni = gl.getUniformLocation(shaderProgram, "tranX");
    tranYUni = gl.getUniformLocation(shaderProgram, "tranY");
    scaleXUni = gl.getUniformLocation(shaderProgram, "scale_X");
    scaleYUni = gl.getUniformLocation(shaderProgram, "scale_Y");

    gl.uniformMatrix4fv(matXUni, false, matX);
    gl.uniformMatrix4fv(matYUni, false, matY);
    gl.uniformMatrix4fv(matZUni, false, matZ);
    gl.uniformMatrix4fv(tranXUni, false, tranX);
    gl.uniformMatrix4fv(tranYUni, false, tranY);
    gl.uniformMatrix4fv(scaleXUni, false, scale_X);
    gl.uniformMatrix4fv(scaleYUni, false, scale_Y);

    // will include depth test to render faces correctly!
    gl.enable( gl.DEPTH_TEST );

    setupShape();

    render();
}

function setupShape() {
    var vertices = [// Bottom face
                    vec4( -.2,  .2,  -.2,  1), // p0
                    vec4( -.2, -.2,  -.2,  1), // p1
                    vec4(  .2, -.2,  -.2,  1), // p2
                    vec4(  .2,  .2,  -.2,  1), // p3
                    // Triangle 1
                    vec4( -.2,  .2,  -.2,  1), // p0 - 4
                    vec4(   0,   0,   .2,  1), // p4 - 5
                    vec4(  .2,  .2,  -.2,  1), // p3 - 6
                    // Triangle 2
                    vec4( -.2,  .2,  -.2,  1), // p0 - 7
                    vec4( -.2, -.2,  -.2,  1), // p1 - 8
                    vec4(   0,   0,   .2,  1), // p4 - 9
                    // Triangle 3
                    vec4(   0,   0,   .2,  1), // p4 - 10
                    vec4( -.2, -.2,  -.2,  1), // p1 - 11
                    vec4(  .2, -.2,  -.2,  1), // p2 - 12
                    // Triangle 4
                    vec4(   0,   0,   .2,  1), // p4 - 13
                    vec4(  .2, -.2,  -.2,  1), // p2 - 14
                    vec4(  .2,  .2,  -.2,  1), // p3 - 15
    ];

    var indexList = [// Bottom face
                     0, 2, 1,
                     0, 3, 2,
                     // Triangle 1
                     4, 5, 6,
                     // Triangle 2
                     7, 8, 9,
                     // Triangle 3
                     10, 11, 12,
                     // Triangle 4
                     13, 14, 15];

    var textureCoordinates = [
        // Bottom face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Triangle 1
        0.0, 0.0,
        1.0, 0.0,
        0.5, 1.0,
        // Triangle 2
        0.0, 0.0,
        1.0, 0.0,
        0.5, 1.0,
        // Triangle 3
        0.0, 0.0,
        1.0, 0.0,
        0.5, 1.0,
        // Triangle 4
        0.0, 0.0,
        1.0, 0.0,
        0.5, 1.0,
    ];
    
    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    let myPosition = gl.getAttribLocation(shaderProgram, "myPosition");
    gl.vertexAttribPointer(myPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(myPosition);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    
    var myColor = gl.getAttribLocation(shaderProgram, "myColor");
    gl.vertexAttribPointer(myColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(myColor);

    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );

    // Setup texture
    textureImage = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureImage);
    const myImage = new Image();
    var url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/640px-SNice.svg.png";
    myImage.crossOrigin = "anonymous";
    myImage.onload = function() {
        gl.bindTexture( gl.TEXTURE_2D, textureImage );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap( gl.TEXTURE_2D ); // only use this if the image is a power of 2
        return textureImage;
    };
    myImage.src = url;

    var textureVertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureVertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);
    
    var textureCoordinate = gl.getAttribLocation(shaderProgram,"textureCoordinate");
    gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(textureCoordinate);


}

function render() {
    if(inputs['x']) {
        rotateAroundX();
    }
    if(inputs['y']) {
        rotateAroundY();
    }
    if(inputs['z']) {
        rotateAroundZ();
    }
    if(inputs['q']) {
        scaleX();
    }
    if(inputs['w']) {
        scaleY();
    }
    if(inputs['a']) {
        translateX();
    }
    if(inputs['s']) {
        translateY();
    }


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureImage);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "texMap0"), 0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_BYTE, 0);
    requestAnimFrame(render);
}

function rotateAroundX() {
    
    alpha += .01;
    matX = [1,
        .0,
        .0,
        .0,
        .0,
        Math.cos(alpha),
        -Math.sin(alpha),
        .0,
        .0,
        Math.sin(alpha),
        Math.cos(alpha),
        .0,
        .0,
        .0,
        .0,
        1.0];

    gl.uniformMatrix4fv(matXUni, false, matX);
}

function rotateAroundY() {
    
    beta += .01;
    matY = [Math.cos(beta),
            .0,
            -Math.sin(beta),
            .0,
            .0,
            1.0,
            .0,
            .0,
            Math.sin(beta),
            .0,
            Math.cos(beta),
            .0,
            .0,
            .0,
            .0,
            1.0];

    gl.uniformMatrix4fv(matYUni, false, matY);
}

function rotateAroundZ() {
    
    gamma += .01;
    matZ = [Math.cos(gamma),
            Math.sin(gamma),
            .0,
            .0,
            -Math.sin(gamma),
            Math.cos(gamma),
            .0,
            .0,
            .0,
            .0,
            1.0,
            .0,
            .0,
            .0,
            .0,
            1.0]

    gl.uniformMatrix4fv(matZUni, false, matZ);
}

function inputDown(event) {
    inputs[event.key] = true;
}

function inputUp(event) {
    inputs[event.key] = false;
}

function scaleX() {
    sx += msx * 0.05;
    if(sx > 5.0) {
        msx = -1.0;
    }
    if(sx < 1.0) {
        msx = 1.0;
    }
    scale_X = [sx, .0, .0, .0,
              .0, 1.0, 0, 0,
              .0, .0, 1.0, .0,
              .0, .0, .0, 1.0];
    gl.uniformMatrix4fv(scaleXUni, false, scale_X);
}

function scaleY() {
    sy += msy * 0.05;
    if(sy > 5.0) {
        msy = -1.0;
    }
    if(sy < 1.0) {
        msy = 1.0;
    }
    scale_Y = [1.0, .0, .0, .0,
              .0, sy, .0, .0,
              .0, .0, 1.0, .0,
              .0, .0, .0, 1.0];
    gl.uniformMatrix4fv(scaleYUni, false, scale_Y);
}

function translateX() {
    xinc += mtx * 0.05;
    if(xinc > 1) {
        mtx = -1.0;
    }
    if(xinc < -1) {
        mtx = 1.0;
    }
    tranX = [1.0, .0, .0, .0,
             .0, 1.0, .0, .0,
             .0, .0, 1.0, .0,
             xinc, .0, .0, 1.0];
    gl.uniformMatrix4fv(tranXUni, false, tranX);
}

function translateY() {
    yinc += mty * 0.05;
    if(yinc > 1) {
        mty = -1.0;
    }
    if(yinc < -1) {
        mty = 1.0;
    }
    tranY = [1.0, .0, .0, .0,
             .0, 1.0, .0, .0,
             .0, .0, 1.0, .0,
             .0, yinc, .0, 1.0];
    gl.uniformMatrix4fv(tranYUni, false, tranY);
}