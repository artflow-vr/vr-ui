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
import { IMAGE_DEFAULT } from '../utils/material-factory';

import * as Colors from '../utils/colors';

export default class ImageButton extends ButtonView {

    constructor( imageOrMaterial, style ) {

        super( style );

        if ( !imageOrMaterial ) {
            let errorMsg = `you did not provide any texture.`;
            throw Error( `ButtonView.ctor(): ` + errorMsg );
        }

        let material = null;

        if ( imageOrMaterial.constructor === THREE.Texture ) {
            material = IMAGE_DEFAULT.clone();
            material.map = imageOrMaterial;
        } else if ( imageOrMaterial instanceof THREE.Material ) {
            material = imageOrMaterial.clone();
        } else {
            let errorMsg = `the provided image is neither a THREE.Texture, `;
            errorMsg += `nor a THREE.Material object.`;
            throw Error( `ButtonView.ctor(): ` + errorMsg );
        }

        this.image = new THREE.Mesh( PLANE_GEOM, material );
        this.group.add( this.image );

        this._onHoverEnter = () => {
            // Changes color on highlight
            this.image.material.color.setHex( Colors.HIGHLIGHT );
        };
        this._onHoverExit = () => {
            this.image.material.color.setHex( Colors.WHITE );
        };

    }

    refresh( maxEltWidth, maxEltHeight ) {

        super.refresh( maxEltWidth, maxEltHeight );

        let dimensions = this._dimensions;
        let padding = dimensions.padding;

        let width = maxEltWidth || dimensions.width;
        let height = maxEltHeight || dimensions.height;

        let newWidth = width - ( padding.left + padding.right );
        let newHeight = height - ( padding.top + padding.bottom );

        this.image.scale.x = newWidth;
        this.image.scale.y = newHeight;
        this.image.position.x += newWidth / 2 + padding.left;
        this.image.position.y -= newHeight / 2 + padding.top;

    }

    clone() {

        return new ImageButton( this.image.material, this.style );

    }

    _forceExit() {
        this.pressed = false;
        this._onHoverExit();
    }

    _intersect( raycaster, state ) {

        if ( !state.pressed && this.pressed ) {
            this.pressed = false;
            if ( this._onChange ) this._onChange( { pressed: this.pressed } );
        }

        if ( !this._checkHover( raycaster, this.image,
                                this._onHoverEnter, this._onHoverExit ) ) {
            return false;
        }

        if ( state.pressed && !this.pressed ) {
            this.pressed = true;
            if ( this._onChange ) this._onChange( { pressed: this.pressed } );
        }

        return true;

    }

}
