import assert from 'assert';

import { setUndefinedProps } from '../../../src/utils/property-check';
import { compareObj } from '../../util/object';

let tests = () => {

    describe( `Object`, () => {

        describe( `setUndefinedProps`, ( ) => {

            let simpleObject = {
                test: 5,
                toto: `string`
            };

            let recObject = {
                toto: {
                    test: 5,
                    test2: 10
                },
                str: `string`
            };

            it( `Empty object`, () => {
                let obj = {};
                let result = {};
                setUndefinedProps( obj, result );
                assert( Object.keys( result ).length === 0, `failed.` );
            } );
            it( `All missing items`, () => {
                let result = {};
                setUndefinedProps( simpleObject, result );
                assert( compareObj( simpleObject, result ), `failed.` );
            } );
            it( `Some missing items`, () => {
                let result = {
                    test: 12
                };
                setUndefinedProps( simpleObject, result );
                assert(
                    result.toto === simpleObject.toto
                    && result.test === 12, `failed.`
                );
            } );
            it( `Recursive object`, () => {
                let result = {};
                setUndefinedProps( recObject, result );
                assert( compareObj( recObject, result ), `failed.` );
            } );

        } );

    } );

};

describe( `Util`, () => {

    tests();

} );
