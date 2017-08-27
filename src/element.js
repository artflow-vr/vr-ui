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

const PROP_TO = {
    background: `_updateBackground`
};

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

        this.group = new THREE.Group();
        this.group.userData.background = null;
        this.group.userData.dimensions = {
            maxWidth: 0.0,
            maxHeight: 0.0,
            halfWidth: 0.0,
            halfHeight: 0.0,
            margin: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            }
        };
        this.group.userData.position = {
            x: 0,
            y: 0,
            z: 0
        };

        this.style = {};
        if ( style )
            this.set( style );

        this._setStyleForUndefined( {
            width: 1.0,
            height: 1.0,
            depth: 0.0,
            padding: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            },
            margin: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            },
            position: `left`
        }, this.style );

    }

    set( style ) {

        for ( let k in style ) {
            if ( checkProperty( k, style[ k ] ) ) {
                this.style[ k ] = style[ k ];
                if ( PROP_TO[ k ] ) {
                    let methodName = PROP_TO[ k ];
                    this[ methodName ]( style[ k ] );
                }
            }
        }

    }

    /**
     *
     * Computes bounds, item size, and move them accordingly.
     *
     * @memberof Element
     */
    _refreshLayout( maxWidth, maxHeight, offset ) {

        let dimensions = this.group.userData.dimensions;

        dimensions.maxWidth = this.style.width * maxWidth;
        dimensions.maxHeight = this.style.height * maxHeight;
        dimensions.halfWidth = dimensions.maxWidth / 2.0;
        dimensions.halfHeight = dimensions.maxHeight / 2.0;

        this.group.userData.position.x = - dimensions.halfWidth;
        this.group.userData.position.y = - dimensions.halfHeight;

        let margin = this.group.userData.dimensions.margin;
        margin.top = this.style.margin.top * maxHeight;
        margin.bottom = this.style.margin.bottom * maxHeight;
        margin.left = this.style.margin.left * maxWidth;
        margin.right = this.style.margin.right * maxWidth;

        let background = this.group.userData.background;
        if ( background ) {
            background.position.x = this.group.userData.position.x;
            background.position.y = this.group.userData.position.y;
            background.position.z = this.group.userData.position.z;
            background.scale.x = dimensions.maxWidth;
            background.scale.y = dimensions.maxHeight;
        }

    }

    _updateBackground( background ) {

        let material = ( background.material || MAT_DEFAULT ).clone();

        if ( !this.group.userData.background ) {
            this.group.userData.background = new THREE.Mesh( PLANE_GEOM, material );
            this.group.add( this.group.userData.background );
        }

        this.group.userData.background.material = material;

    }

    _setStyleForUndefined( style, writeTo ) {

        for ( let k in style ) {
            let element = style[ k ];
            if ( typeof element === `object` ) {
                if ( !( k in writeTo ) ) writeTo[ k ] = {};
                this._setStyleForUndefined( element, writeTo[ k ] );
            } else if ( !( k in writeTo ) ) {
                writeTo[ k ] = style[ k ];
            }
        }

    }

    /*_setValueUndefined( obj, id, value ) {

    }*/

}
