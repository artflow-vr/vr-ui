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

import LinearLayout from './linear-layout';

export default class HorizontalLayout extends LinearLayout {

    constructor( style ) {

        super( style );

    }

    refresh( maxEltWidth, maxEltHeight ) {

        super.refresh( maxEltWidth, maxEltHeight );
        this.type = `horizontal-layout`;

        let dimensions = this._dimensions;
        let maxHeight = this._dimensions.height;

        let offset = {
            left: 0,
            center: 0,
            right: 0
        };
        for ( let elt of this._elements ) {
            elt.refresh();
            let eltDim = elt._dimensions;

            switch ( elt.style.position ) {
                case `right`:
                    offset.right += eltDim.margin.right + eltDim.width;
                    elt.group.position.x = dimensions.width - offset.right;
                    offset.right += eltDim.margin.left;
                    break;
                case `left`:
                    offset.left += eltDim.margin.left;
                    elt.group.position.x = offset.left;
                    offset.left += eltDim.width;
                    offset.left += eltDim.margin.right;
                    break;
            }

            switch ( elt.style.align ) {
                case `top`:
                    elt.group.position.y = 0;
                break;
                case `bottom`:
                    elt.group.position.y = - maxHeight + eltDim.height;
                break;
                case `center`:
                    elt.group.position.y = - ( maxHeight / 2.0 ) + eltDim.halfH;
                break;
            }

        }

    }

}
