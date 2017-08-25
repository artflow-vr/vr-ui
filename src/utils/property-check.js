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

let checkFloatInRange = ( min, max, propID, value ) => {

    if ( value < min || value > max ) {
        let errorMsg = `Element property ${propID} should be in the range `;
        errorMsg += `[${min}, ${max}]`;
        console.error( errorMsg );
        return false;
    }

    return true;

};

let PROP_CHECK = {
    width: checkFloatInRange.bind( 0.0, 1.0 ),
    height: checkFloatInRange.bind( 0.0, 1.0 ),
    depth: checkFloatInRange.bind( 0.0, 1.0 ),
    paddingTop: checkFloatInRange.bind( 0.0, 0.49 ),
    paddingBottom: checkFloatInRange.bind( 0.0, 0.49 ),
    paddingLeft: checkFloatInRange.bind( 0.0, 0.49 ),
    paddingRight: checkFloatInRange.bind( 0.0, 0.49 ),
    background: function() {
        return true;
    }
};

export default function checkProperty( propID, value ) {

    if ( !( propID in PROP_CHECK ) ) {
        let warnMsg = `property ${propID} is not recognized. Please take a `;
        warnMsg += `look at the documentation to see the complete set.`;
        console.warn( `checkProperty(): ` + warnMsg );
        return false;
    }

    return PROP_CHECK[ propID ]( propID, value );

}
