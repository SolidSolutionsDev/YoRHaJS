import React, {Component} from 'react';

export class Input extends Component {

  componentWillMount()
    {

      document.addEventListener( 'keydown', function( event ) {
        // console.log( 'Pressed: ', event.keyCode );

        if ( event.key === 'ArrowLeft' )
          {
            document.dispatchEvent( new Event( 'moveleft' )
            )
            ;
          }

        if ( event.key === 'ArrowRight' )
          {
            document.dispatchEvent( new Event( 'moveright' )

            )
            ;
          }

        if ( event.key === 'r' )
          {
            document.dispatchEvent( new Event( 'restartGame' )

            )
            ;
          }

        if ( event.key === ' ')
          {
            document.dispatchEvent( new Event( 'shoot' ) );
          }

        if ( event.key === 'c' )
          {
            document.dispatchEvent( new Event( 'camera_change' ) );
          }
      } );
    }

  render()
    {
      return null;
    }

}