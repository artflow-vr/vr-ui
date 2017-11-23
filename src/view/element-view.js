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

import Element from '../element';

import * as Colors from '../utils/colors';

export default class ElementView extends Element {

    constructor( data, mesh, style ) {

        if ( mesh === undefined || mesh === null ) {
            let errorMsg = `provided mesh is null or undefined.`;
            throw Error( `ElementView: ctor(): ` + errorMsg );
        }

        if ( !( mesh instanceof THREE.Object3D ) ) {
            let errorMsg = `provided mesh is not of type THREE.Mesh.`;
            throw Error( `ElementView: ctor(): ` + errorMsg );
        }

        super( data, style );

        this.mesh = mesh;
        this.mesh.position.z = 0.001; // prevents z-fighting
        this.group.add( this.mesh );

        this.pressed = false;

        this.listenTo = null;

        this._initialColor = new THREE.Color();

        this._onHoverEnter = ( object ) => {

            this._initialColor.copy( object.mesh.material.color );
            object.mesh.material.color.setHex( Colors.HIGHLIGHT );

        };
        this._onHoverExit = ( object ) => {

            object.mesh.material.color.copy( this._initialColor );

        };

    }

    listen( obj, propID ) {

        this.listenTo = {
            object: obj,
            propID: propID
        };

        return this;

    }

    refresh( maxEltWidth, maxEltHeight ) {

        // TODO: Padding and marging are not working correctly.

        super.refresh( maxEltWidth, maxEltHeight );

        let dimensions = this._dimensions;
        let padding = dimensions.padding;

        let width = dimensions.width;
        let height = dimensions.height;

        let newWidth = width - ( padding.left + padding.right );
        let newHeight = height - ( padding.top + padding.bottom );

        let xOffset = 0;
        let yOffset = 0;

        if ( this.type !== `text` ) {
            this.mesh.scale.x = newWidth;
            this.mesh.scale.y = newHeight;
            xOffset = width * 0.5 + ( padding.left - padding.right );
            yOffset = - height * 0.5 + ( padding.bottom - padding.top );
        } else {
            this.mesh.scale.multiplyScalar( newHeight );
            xOffset = newWidth;
            yOffset = newHeight * 0.5;
        }
        this.mesh.position.x = xOffset;
        this.mesh.position.y = yOffset;

    }

    _intersect( raycaster, state ) {

        if ( !state.pressed && this.pressed ) {
            this.pressed = false;
            if ( this._onChange ) {
                this._onChange( this, {
                    pressed: this.pressed,
                    info: this._lastIntersect
                } );
            }
        }

        let intersectionInfo = this._checkHover( raycaster, this.mesh,
            this._onHoverEnter, this._onHoverExit );

        if ( !intersectionInfo )
            return null;

        if ( state.pressed && !this.pressed ) {
            this.pressed = true;
            if ( this._onChange ) {
                this._onChange( this, {
                    pressed: this.pressed,
                    info : intersectionInfo
                } );
            }
        }

        return intersectionInfo;

    }

    _forceExit() {

        this.pressed = false;

    }

}
