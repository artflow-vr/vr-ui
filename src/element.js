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

import { PLANE_GEOM, BOX_GEOM } from './utils/geometry-factory';
import { MAT_DEFAULT } from './utils/material-factory';

import checkProperty from './utils/property-check';

/**
 *
 * Abstract class describing an element: layout, view, ...
 * Contains element-relative options, e.g: width, height, paddingTop...
 *
 * @export
 * @class Element
 */
export default class Element {

    constructor( style ) {

        this.style = {};
        if ( style )
            this.set( style );

        this._setIfUndefined( {
            width: 1.0,
            height: 1.0,
            depth: 0.0,
            paddingTop: 0.0,
            paddingBottom: 0.0,
            paddingLeft: 0.0,
            paddingRight: 0.0,
            position: `left`
        } );

        this.group = new THREE.Group();

        // Creates a plane / box used as a background for the element.
        // For more information, you can check the documentation to see
        // every options you can give to the `background`style option.
        let background = this.style.background;
        if ( background ) {
            let material = background.material || MAT_DEFAULT.clone();
            let geom = this.style.depth <= 0.0001 ? PLANE_GEOM : BOX_GEOM;
            let mesh = new THREE.Mesh( geom, material );
            mesh.scale.x = this.style.width;
            mesh.scale.y = this.style.height;
            if ( this.style.depth > 0.0001 )
                mesh.scale.z = this.style.depth;
            mesh.position.z = -0.05;
            this.group.add( mesh );
        }

        this._dimensions = {
            maxWidth: 0.0,
            maxHeight: 0.0,
            halfWidth: 0.0,
            halfHeight: 0.0
        };
    }

    /**
     *
     * Computes bounds, item size, and move them accordingly.
     *
     * @memberof Element
     */
    _refreshLayout( maxWidth, maxHeight, offset ) {

        this._dimensions.maxWidth = this.style.width * maxWidth;
        this._dimensions.maxHeight = this.style.height * maxHeight;
        this._dimensions.halfWidth = this._dimensions.maxWidth / 2.0;
        this._dimensions.halfHeight = this._dimensions.halfHeight / 2.0;

        if ( offset ) {
            let { x, y, z } = offset;
            this.group.position.x += x || 0;
            this.group.position.y += y || 0;
            this.group.position.z += z || 0;
        }

        /*let horizontalPad = this.style.paddingLeft + this.style.paddingRight;
        let verticalPad = this.style.paddingTop + this.style.paddingBottom;

        this._width = maxWidth * ( this.style.width - horizontalPad );
        this._height = maxHeight * ( this.style.height - verticalPad );*/

    }

    set( style ) {

        for ( let k in style )
            if ( checkProperty( k, style[ k ] ) ) this.style[ k ] = style[ k ];

    }

    _setIfUndefined( style ) {

        for ( let k in style )
            if ( !( k in this.style ) ) this.style[ k ] = style[ k ];

    }

}
