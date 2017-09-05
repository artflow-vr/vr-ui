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

let checkStringInList = ( list, propID, value ) => {

    if ( !list.includes( value ) ) {
        let errorMsg = `Element property ${propID} should have one of the `;
        errorMsg += `following values: ` + list.toString();
        console.error( errorMsg );
        return false;
    }

    return true;

};

let checkInstanceOf = ( list, propID, value ) => {

    if ( !value ) return true;

    for ( let Type of list ) {
        if ( ( Type === `number` && !isNaN( value ) ) || value instanceof Type )
            return true;
    }

    let errorMsg = `Element property ${propID} does not have the good type `;
    console.error( errorMsg );

    return false;

};

let PROP_CHECK = {
    width: checkFloatInRange.bind( 0.0, 1.0 ),
    height: checkFloatInRange.bind( 0.0, 1.0 ),
    depth: checkFloatInRange.bind( 0.0, 1.0 ),
    padding: {
        top: checkFloatInRange.bind( 0.0, 0.49 ),
        bottom: checkFloatInRange.bind( 0.0, 0.49 ),
        left: checkFloatInRange.bind( 0.0, 0.49 ),
        right: checkFloatInRange.bind( 0.0, 0.49 )
    },
    margin: {
        top: checkFloatInRange.bind( 0.0, 0.49 ),
        bottom: checkFloatInRange.bind( 0.0, 0.49 ),
        left: checkFloatInRange.bind( 0.0, 0.49 ),
        right: checkFloatInRange.bind( 0.0, 0.49 )
    },
    position: checkStringInList.bind( null, [`left`, `right`] ),
    align: checkStringInList.bind( null, [`top`, `bottom`, `center`] ),
    background: checkInstanceOf.bind( null, [THREE.Material, THREE.Texture, `number`] )
};

export default function checkProperty( propID, value, checkList = PROP_CHECK ) {

    let property = checkList[ propID ];

    if ( !property ) {
        let warnMsg = `property ${propID} is not recognized. Please take a `;
        warnMsg += `look at the documentation to see the complete set.`;
        console.warn( `checkProperty(): ` + warnMsg );
        return false;
    }

    if ( typeof property === `object` ) {
        for ( let k in property ) {
            if ( !checkProperty( k, value[ k ], checkList[ propID ] ) )
                return false;
        }
        return true;
    }

    return property( propID, value );

}
