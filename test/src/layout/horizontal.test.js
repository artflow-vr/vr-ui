let THREE = require( `three` );
document.THREE = THREE;

import assert from 'assert';

import HorizontalLayout from '../../../src/layout/horizontal-layout';

let tests = () => {

    describe( `HorizontalLayout`, () => {

        it( `instanciation`, () => {
            let layout = new HorizontalLayout();
            assert( layout._elements.length === 0, `failed.` );
        } );
        /*it( `one child`, () => {
            let layout = new HorizontalLayout();
            assert( layout._elements.length === 0, `failed.` );
        } );*/
        // TODO: Clone test
        /*it( `Recursive object`, () => {
            let result = {};
            setUndefinedProps( recObject, result );
            assert( compareObj( recObject, result ), `failed.` );
        } );*/

    } );
    //Element

};

describe( `Layout`, () => {

    tests();

} );
