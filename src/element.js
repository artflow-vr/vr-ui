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

let THREE = window.THREE;

/**
 *
 * Abstract class describing an element: layout, view, ...
 * Contains element-relative options, e.g: width, height, paddingTop...
 *
 * @export
 * @class Element
 */
export default class Element {

    constructor( options ) {

        // The class should be abstract
        if ( this.method === undefined ) {
            let errorMsg = 'the Element prorotype is abstract.';
            throw new TypeError( 'Element: ctor(): ' + errorMsg );
        }

        this.options = {};
        if ( options )
            for ( let k in options ) this.options[ k ] = options[ k ];

        this._setIfUndefined( {
            width: 1.0,
            height: 1.0,
            paddingTop: 0.0,
            paddingBottom: 0.0,
            paddingLeft: 0.0,
            paddingRight: 0.0
        } );

        this.group = new THREE.Group();

    }

    /**
     *
     * Computes bounds, item size, and move them accordingly.
     *
     * @memberof Element
     */
    perform() { }

    _setIfUndefined( options ) {

        for ( let k in options )
            if ( !( k in this.options ) ) this.options[ k ] = options[ k ];

    }

}
