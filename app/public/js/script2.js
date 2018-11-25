// window.onload = function () {
//     var monitor = document.createElement ( "canvas" );
//
//     var canvasWidth = 1920,
//         canvasHeight = 420;
//
//     monitor.width = canvasWidth;
//     monitor.height = canvasHeight;
//
//     document.getElementById('first_div').appendChild ( monitor );
//
//     var ctx = monitor.getContext ( "2d" );
//
//     ctx.save ();
//
//     ctx.shadowColor = '#eaeaea';
//     ctx.shadowBlur = 10;
//     ctx.shadowOffsetX = 2;
//     ctx.shadowOffsetY = 2;
//
//     ctx.beginPath ();
//
//
//
//     ctx.closePath ();
//
//
//
//     var screenWidth = 1920,
//         screenHeight = 420,
//         screenTop = 5,
//         screenLeft = 5;
//
//     function screenBackgroundRender ( a ) {
//
//         ctx.beginPath ();
//
//         ctx.fillStyle = 'rgba( 49, 61, 70, ' + a + ' )';
//         ctx.fillRect ( screenLeft, screenTop, screenWidth, screenHeight );
//
//         ctx.closePath ();
//
//         ctx.beginPath ();
//
//         // for ( var j = 10 + screenTop; j < screenTop + screenHeight; j = j + 10 ) {
//         //     ctx.moveTo( screenLeft, j );
//         //     ctx.lineTo( screenLeft + screenWidth, j );
//         // }
//         //
//         // for ( var i = 10 + screenLeft; i < screenLeft + screenWidth; i = i + 10 ) {
//         //     ctx.moveTo( i, screenTop );
//         //     ctx.lineTo( i, screenTop + screenHeight );
//         // }
//
//         ctx.lineWidth = 1;
//         // ctx.strokeStyle = 'rgba( 20, 50, 20, ' + a + ' )';
//         ctx.stroke ();
//         ctx.closePath ();
//
//     }
//
//     ctx.shadowBlur = 0;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//     screenBackgroundRender ( 1 );
//
//
//     //animation
//     PosX = screenLeft;
//     PosY = screenTop + screenHeight / 2;
//
//     setInterval ( function () {
//
//         ctx.restore ();
//
//         screenBackgroundRender ( 0.1 );
//
//         ctx.beginPath ();
//         ctx.moveTo( PosX, PosY );
//         PosX = PosX + 1;
//         if ( PosX >= screenLeft + screenWidth * 40 / 100 && PosX < screenLeft + screenWidth * 45 / 100 ) {
//             PosY = PosY - (screenHeight / 2) * 3 / 100;
//         }
//         if ( PosX >= screenLeft + screenWidth * 45 / 100 && PosX < screenLeft + screenWidth * 55 / 100 ) {
//             PosY = PosY - (screenHeight / 2) * 3 / 100;
//         }
//         if ( PosX >= screenLeft + screenWidth * 55 / 100 && PosX < screenLeft + screenWidth * 60 / 100 ) {
//             PosY = PosY - (screenHeight / 2) * 3 / 100;
//         }
//         if ( PosX >= screenLeft + screenWidth * 60 / 100 && PosX <= screenLeft + screenWidth ) {
//             PosY = screenTop + screenHeight / 2;
//         }
//         if ( PosX > screenLeft + screenWidth ) {
//             PosX = screenLeft;
//             ctx.moveTo( PosX, PosY );
//         }
//         ctx.lineTo( PosX, PosY );
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = '#ffffff';
//         ctx.stroke ();
//         ctx.closePath ();
//
//     }, 6 );
// };