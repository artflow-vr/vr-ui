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

export default class VerticalLayout extends LinearLayout {

    constructor( style ) {

        super( style );

    }

    refresh() {

        super.refresh();

        let maxWidth = this._dimensions.width;

        let yOffset = 0;
        for ( let elt of this._elements ) {
            elt.refresh();

            let eltDim = elt._dimensions;
            yOffset -= eltDim.margin.top;

            elt.group.position.y = yOffset;

            // For now, the library only handle simple positioning.
            // We can change horizontal placement in a VerticalLayout.
            // You can choose between 'left', 'right', and 'center'.
            switch ( elt.style.position ) {
                case `left`:
                    elt.group.position.x = 0;
                    break;
                case `right`:
                    elt.group.position.x = maxWidth - eltDim.width;
                    break;
                case `center`:
                    elt.group.position.x = ( maxWidth / 2.0 ) - eltDim.halfW;
                    break;
            }

            yOffset -= eltDim.height;
            yOffset -= eltDim.margin.bottom;
        }

    }

}
