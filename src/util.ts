import { PackedCircleObject } from "./CirclePacker";
import { Size } from "./PackedCircleManager";
import PackedCircle from "./PackedCircle";

export function random ( min, max, intResult ) {
	if ( typeof min !== 'number' && typeof max !== 'number' ) {
		min = 0;
		max = 1;
	}

	if ( typeof max !== 'number' ) {
		max = min;
		min = 0;
	}

	let result = min + Math.random() * ( max - min );

	if ( intResult ) {
		result = parseInt( result, 10 );
	}

	return result;
}

export function sendWorkerMessage ( worker : Worker, msg : any ) {
	worker.postMessage( JSON.stringify( msg ) );
}


export function isCircleValid ( circle : PackedCircle ) {
	return circle &&
		circle.id &&
		circle.radius &&
		circle.position &&
		typeof circle.position.x === 'number' &&
		typeof circle.position.y === 'number'
}

export function isSizeValid ( size : Size ) {
	return size &&
		typeof size.width === 'number' &&
		typeof size.height === 'number'
}