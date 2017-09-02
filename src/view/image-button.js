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

import ButtonView from './button-view';
import { PLANE_GEOM } from '../utils/geometry-factory';
import { MAT_DEFAULT } from '../utils/material-factory';

export default class ImageButton extends ButtonView {

    constructor( imageOrMaterial, style ) {

        super( style );

        if ( !imageOrMaterial ) {
            let errorMsg = `you did not provide any texture.`;
            throw Error( `ButtonView.ctor(): ` + errorMsg );
        }

        let material = null;

        if ( imageOrMaterial.constructor === THREE.Texture ) {
            material = MAT_DEFAULT.clone();
            material.map = imageOrMaterial;
        } else if ( imageOrMaterial.constructor === THREE.Texture ) {
            material = imageOrMaterial;
        } else {
            let errorMsg = `the provided image is neither a THREE.Texture, `;
            errorMsg += `nor a THREE.Material object.`;
            throw Error( `ButtonView.ctor(): ` + errorMsg );
        }

        this.image = new THREE.Mesh( PLANE_GEOM, material );
        this.group.add( this.image );

    }

    _intersect( raycaster ) {

        let objs = raycaster.intersectObject( this.image, false );
        if ( objs.length === 0 ) return false;

        return true;

    }

    _refreshLayout( maxWidth, maxHeight ) {

        super._refreshLayout( maxWidth, maxHeight );

        let dimensions = this.group.userData.dimensions;
        let padding = dimensions.padding;

        let width = dimensions.maxWidth;
        let height = dimensions.maxHeight;
        let newWidth = width - ( padding.left + padding.right );
        let newHeight = height - ( padding.top + padding.bottom );

        this.image.scale.x = newWidth;
        this.image.scale.y = newHeight;
        this.image.position.x += newWidth / 2 + padding.left;
        this.image.position.y -= newHeight / 2 + padding.top;

    }

}
