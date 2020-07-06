( function( d ) {
  'use strict';

   var test = true,
       but = d.querySelector( '#button' ),
       aud = d.querySelector( '#audioplayer' );
       aud.classList.add( 'remove' );
       d.querySelector( '#button-container' ).classList.remove( 'hide' );

   but.addEventListener('click',
      function() {
         if ( test === true ) {
              but.classList.add( 'pause' );
              test = false;
              aud.play();
         }
         else {
              changeSVG();
              aud.pause();
         }
      }, false );

   aud.addEventListener( 'ended',
      function() {
         changeSVG();
         aud.load();
       }, false );

   function changeSVG() {
      but.classList.remove( 'pause' );
      test = true;
    }
 }( document ));