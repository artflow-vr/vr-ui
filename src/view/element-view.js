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

    constructor( mesh, style ) {

        if ( mesh === undefined || mesh === null ) {
            let errorMsg = `provided mesh is null or undefined.`;
            throw Error( `ElementView: ctor(): ` + errorMsg );
        }

        if ( !( mesh instanceof THREE.Object3D ) ) {
            let errorMsg = `provided mesh is not of type THREE.Mesh.`;
            throw Error( `ElementView: ctor(): ` + errorMsg );
        }

        super( style );

        this.mesh = mesh;
        this.mesh.position.z = 0.001; // prevents z-fighting
        this.group.add( this.mesh );

        this.pressed = false;

        this.listenTo = null;

        this._onHoverEnter = ( object ) => {

            object.mesh.material.color.setHex( Colors.HIGHLIGHT );

        };
        this._onHoverExit = ( object ) => {

            object.mesh.material.color.setHex( Colors.WHITE );

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
            xOffset = this.mesh.scale.x;
            yOffset = this.mesh.scale.y;
        } else {
            this.mesh.scale.multiplyScalar( newHeight );
            xOffset = newWidth;
            yOffset = newHeight * 0.5;
        }
        this.mesh.position.x += xOffset / 2 + padding.left;
        this.mesh.position.y -= yOffset / 2 + padding.top;

    }

    _intersect( raycaster, state ) {

        if ( !state.pressed && this.pressed ) {
            this.pressed = false;
            if ( this._onChange ) this._onChange( this, { pressed: this.pressed } );
        }

        if ( !this._checkHover( raycaster, this.mesh,
            this._onHoverEnter, this._onHoverExit ) ) {
            return false;
        }

        if ( state.pressed && !this.pressed ) {
            this.pressed = true;
            if ( this._onChange ) this._onChange( this, { pressed: this.pressed } );
        }

        return true;

    }

    _forceExit() {

        this.pressed = false;

    }

}
