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

import Element from './element';

export default class Page {

    constructor( root, widthUnit, heightUnit, depthUnit = 0.0 ) {

        if ( !widthUnit || widthUnit <= 0 ) {
            let errorMsg = `parent layout should have a width specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `Page.ctor(): ` + errorMsg );
        }
        if ( !heightUnit || heightUnit <= 0 ) {
            let errorMsg = `parent layout should have a height specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `Page.ctor(): ` + errorMsg );
        }

        if ( !root ) {
            let errorMsg = `Page should be provided either a layout or a view.`;
            throw new TypeError( `Page.ctor(): ` + errorMsg );
        }

        if ( !( root instanceof Element ) ) {
            let errorMsg = `the provided root does not inherit from `;
            errorMsg += `VRUI.Element.`;
            throw new TypeError( `Page.ctor(): ` + errorMsg );
        }

        this.root = root;
        this.width = widthUnit;
        this.height = heightUnit;
        this.depth = depthUnit;

    }

    refresh() {

        this.root._refreshLayout( this.width, this.height );

    }

    group() {

        return this.root.group;

    }

}
