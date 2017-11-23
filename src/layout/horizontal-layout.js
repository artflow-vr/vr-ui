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

    constructor( data, style ) {

        super( data, style );

    }

    refresh( maxEltWidth, maxEltHeight ) {

        // TODO: Padding and marging are not working correctly.

        super.refresh( maxEltWidth, maxEltHeight );
        this.type = `horizontal-layout`;

        let dimensions = this._dimensions;
        let maxHeight = this._dimensions.height;

        let padding = dimensions.padding;

        let offset = {
            top: - padding.top + padding.bottom,
            bottom: padding.bottom,
            right: padding.right,
            left: padding.left
        };

        // Computes bounds by adding padding to the whole layout.
        // The new width is the total width witout the padding width.
        // The new height is the total height witout the padding height.
        let paddedWidth = dimensions.width - ( padding.left + padding.right );
        let paddedHeight = dimensions.height - ( padding.top + padding.bottom );

        for ( let elt of this._elements ) {
            elt.refresh( paddedWidth, paddedHeight );
            let eltDim = elt._dimensions;

            switch ( elt.style.position ) {
                case `right`:
                    offset.right += eltDim.margin.right + eltDim.width;
                    elt.group.position.x = dimensions.width - offset.right;
                    offset.right += eltDim.margin.left;
                    break;
                case `left`:
                case `center`:
                    offset.left += eltDim.margin.left;
                    elt.group.position.x = offset.left;
                    offset.left += eltDim.width;
                    offset.left += eltDim.margin.right;
                    break;
            }

            switch ( elt.style.align ) {
                case `top`:
                    elt.group.position.y = offset.top + eltDim.margin.top;
                    break;
                case `bottom`:
                    elt.group.position.y = - maxHeight + eltDim.margin.bottom +
                        eltDim.height + offset.top;
                    break;
                case `center`:
                    elt.group.position.y = - ( paddedHeight * 0.5 ) + eltDim.halfH;
                    break;
            }

        }

    }

    /**
     * Checks whether the layout is full or not.
     * Note: this function is O(n), because developer can remove elements by
     * hand.
     *
     */
    isFull() {

        let width = 0.0;
        for ( let elt of this._elements ) {
            width += elt.style.width;
        }
        return width >= 1.0;

    }

}
