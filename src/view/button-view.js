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

import AbstractView from './abstract-view';

import { PLANE_GEOM, BOX_GEOM } from '../utils/geometry-factory';
import { MAT_DEFAULT } from '../utils/material-factory';

export default class ButtonView extends AbstractView {

    constructor( style ) {

        super( style );

        if ( !this.style.image ) {
            let errorMsg = `you did not provide any texture.`;
            throw Error( `ButtonView: ctor(): ` + errorMsg );
        }

        let image = this.style.image;
        if ( !( image instanceof THREE.Texture ) ) {
            let errorMsg = `the provided image is not a THREE.Texture object`;
            throw Error( `ButtonView: ctor(): ` + errorMsg );
        }

        let material = MAT_DEFAULT.clone();
        material.map = image.clone();

        let geom = this.style.depth <= 0.0001 ? PLANE_GEOM : BOX_GEOM;
        let mesh = new THREE.Mesh( geom, material );
        mesh.scale.x = this.style.width;
        mesh.scale.y = this.style.height;
        if ( this.style.depth > 0.0001 )
            mesh.scale.z = this.style.depth;

        this.group.add( mesh );

    }

    perform() {

    }

}
