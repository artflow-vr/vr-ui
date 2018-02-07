import { expect } from 'chai';

import VRUI from 'main';

import CheckboxView from 'view/checkbox-view';
import SliderView from 'view/slider-view';
import ImageButton from 'view/image-button';

import HorizontalLayout from 'layout/horizontal-layout';
import VerticalLayout from 'layout/vertical-layout';
import GridLayout from 'layout/grid-layout';

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

let checkCurrPage = function( ui, expId, prevId ) {
  
  expect( ui._pageId ).to.equal( expId );
  expect( ui.currPage ).to.equal( ui.pages[ expId ] );
  expect( ui.pages[ prevId ].visible ).to.equal( false );
  expect( ui.pages[ expId ].visible ).to.equal( true );

}

////////////////////////////////////////////////////////////////////////////////
// Tests
////////////////////////////////////////////////////////////////////////////////

/*
  These tests are in charge of checking the basic API entry point.
  It will run basic unit tests on all the functions, check if the pages are
  created, etc...

  It is not in charge of checking the whole layout! for this, you have to refer
  to the other tests.
*/
let tests = () => {

  describe( `Instanciation`, () => {

    it ( `wrong arguments`, () => {
      expect( () => { let ui = new VRUI() } ).to.throw( TypeError );
      expect( () => { new VRUI( { width: 100 } ) } ).to.throw( TypeError );
      expect( () => { new VRUI( { height: 100 } ) } ).to.throw( TypeError );
    } );

    let w = 0.2;
    let h = 0.5;

    let ui = new VRUI( { width: w, height: h } );

    it ( `default data`, () => {
      expect( ui.pages.length, 'nb pages' ).to.equal( 0 );
      expect( ui.enabled, 'enabled' ).to.equal( true );
      expect( ui.inputObject, 'inputObject' ).to.be.a( 'null' );
      expect( ui.data.width, 'width' ).to.equal( w );
      expect( ui.data.height, 'height' ).to.equal( h );
    });

  } );

  describe( `AddPage()`, () => {

    let dim = { width: 0.5, height: 0.5 };

    it ( `wrong arguments`, () => {
      let ui = new VRUI( { width: 0.5, height: 0.5 } );
      expect( () => { ui.addPage(); } ).to.throw( TypeError );
      expect( () => { ui.addPage( 'test' ); } ).to.throw( TypeError );
      expect( () => { ui.addPage( new THREE.Mesh() ); } ).to.throw( TypeError );
    } );

    it ( `first page data check`, () => {
      let ui = new VRUI( dim );
      ui.addPage( new CheckboxView() );

      let page = ui.pages[ ui.pages.length - 1 ];
      expect( ui.pages.length == 1 );      
      expect( page._parentDimensions ).to.include( dim );
      expect( page.visible ).to.equal( true );
      expect( ui._pageId ).to.equal( 0 );
    } );

    describe( `Views`, () => {
      
      // We will check to add only these elements into a unique UI.
      let toInst = [ CheckboxView, ImageButton, SliderView ];
      // These are the data we need to instanciate above views.
      let extraParams = [
        undefined,
        { innerMaterial: 0xFFFFFF },
        undefined
      ];

      for ( let i = 0; i < toInst.length; ++i ) {
        it ( toInst[ i ].name, () => {
          let inst = toInst[ i ];
          let ui = new VRUI( dim );
          ui.addPage( new inst( extraParams[ i ] ) );  
          expect( ui.pages[ 0 ] ).to.be.an.instanceof( inst );
        } );
      }

    });

    describe( `Layouts`, () => {

      // We will check to add only these elements into a unique UI.
      let toInst = [ HorizontalLayout, VerticalLayout, GridLayout ];
      // These are the data we need to instanciate above views.
      let extraParams = [
        undefined,
        undefined,
        { rows: 3, columns: 5 }
      ];

      for ( let i = 0; i < toInst.length; ++i ) {
        it ( toInst[ i ].name, () => {
          let inst = toInst[ i ];
          let ui = new VRUI( dim );
          ui.addPage( new inst( extraParams[ i ] ) );  
          expect( ui.pages[ 0 ] ).to.be.an.instanceof( inst );
        } );
      }

    });

  } );

  describe( `NextPage() / PrevPage()`, () => {

    let ui = new VRUI( { width: 0.5, height: 0.5 } );      
    let elts = [ HorizontalLayout, VerticalLayout, CheckboxView ];

    for ( let i = 0; i < elts.length; ++i ) {
      ui.addPage( new elts[ i ] );
      ui.refresh();
    }

    // Checks number of pages, as well as their data (visibility, etc...).
    it ( `check pages data`, () => {
      expect( ui.pages.length ).to.equal( 3 );
      expect( ui._pageId ).to.equal( 0 );
      expect( ui.pages[ 0 ].visible ).to.equal( true );
      for ( let i = 1; i < ui.pages.length; ++i )
        expect( ui.pages[ i ].visible ).to.equal( false );
    } );

    it ( `one next`, () => {
      ui.nextPage();
      checkCurrPage( ui, 1, 0 );
    } )

    it ( `next complete rotation`, () => {
      ui.nextPage();
      ui.nextPage();
      checkCurrPage( ui, 0, 1 );
    } )

    it ( `previous complete rotation`, () => {
      ui.prevPage();
      checkCurrPage( ui, 2, 0 );
    } )

    it ( `one previous`, () => {
      ui.prevPage();
      checkCurrPage( ui, 1, 2 );
    } )

  } );

  describe( `Add()`, () => {

    it ( `wrong arguments`, () => {
      let ui = new VRUI( { width: 0.5, height: 0.5 } );
      expect( () => { ui.add(); } ).to.throw( TypeError );
      expect( () => { ui.add( 'test' ); } ).to.throw( TypeError );
      expect( () => { ui.add( new THREE.Mesh() ); } ).to.throw( TypeError );
    } );

  } );

};

export default () => {

  describe( `Main`, () => {

    tests();

  } );

};
