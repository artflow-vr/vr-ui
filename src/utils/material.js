/**
* VRUI Javascript UI Library
* https://github.com/artflow-vr/vr-ui
*
* MIT License
*
* Copyright (c) 2017 artflow-vr
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import * as Colors from './colors';

let MaterialFactory = {
    MAT_USELESS: new THREE.MeshBasicMaterial( {
        color: Colors.WHITE,
        visible: false
    } ),
    MAT_DEFAULT: new THREE.MeshBasicMaterial( {
        color: Colors.WHITE,
        transparent: true,
        opacity: 1.0
    } ),
    IMAGE_DEFAULT: new THREE.MeshBasicMaterial( {
        color: Colors.WHITE,
        alphaTest : 0.01,
        transparent: false
    } ),
    BACK_DEFAULT: new THREE.MeshBasicMaterial( {
        color: Colors.WHITE,
        depthWrite: false,
        transparent : true
    } )
};

let createMaterial = ( matOrImageOrColor,
                        materialTemplate = MaterialFactory.MAT_DEFAULT ) => {

    if ( matOrImageOrColor instanceof THREE.Material ) {
        return matOrImageOrColor.clone();
    }

    if ( matOrImageOrColor.constructor === THREE.Texture ) {
        let mat = materialTemplate.clone();
        mat.map = matOrImageOrColor;
        return mat;
    }

    if ( !isNaN( matOrImageOrColor ) ) {
        let mat = materialTemplate.clone();
        mat.color.setHex( matOrImageOrColor );
        return mat;
    }

    let errorMsg = `the provided image is neither a THREE.Texture, `;
    errorMsg += `nor a THREE.Material object, nor an hexadecimal color.`;

    throw Error( `createMaterial(): ` + errorMsg );

};

export {
    MaterialFactory,
    createMaterial
};
