import { expect } from 'chai';

import VRUI from 'main';
import HorizontalLayout from 'layout/horizontal-layout';

let tests = () => {

  describe( `Instanciation`, () => {

    it ( `Wrong arguments`, () => {
      // No data
      expect( () => { let ui = new VRUI() } ).to.throw( TypeError );
      // Wrong height
      expect( () => { new VRUI( { width: 100 } ) } ).to.throw( TypeError );
      // Wrong width
      expect( () => { new VRUI( { height: 100 } ) } ).to.throw( TypeError );
    } );

    let w = 0.2;
    let h = 0.5;

    let ui = new VRUI( { width: w, height: h } );

    it ( `Default data`, () => {
      expect( ui.pages.length, 'nb pages' ).to.equal( 0 );
      expect( ui.enabled, 'enabled' ).to.equal( true );
      expect( ui.inputObject, 'inputObject' ).to.be.a( 'null' );
      expect( ui.data.width, 'width' ).to.equal( w );
      expect( ui.data.height, 'height' ).to.equal( h );
    });

  } );

  describe( `Add`, () => {

    let ui = new VRUI( { width: 0.5, height: 0.5 } );

    it ( `Wrong arguments`, () => {
      expect( () => { ui.add(); } ).to.throw( TypeError );
      expect( () => { ui.add( 'test' ); } ).to.throw( TypeError );
      expect( () => { ui.add( new THREE.Mesh() ); } ).to.throw( TypeError );
    } );

  } );

};

export default () => {

  describe( `Simple`, () => {

    tests();

  } );

};
