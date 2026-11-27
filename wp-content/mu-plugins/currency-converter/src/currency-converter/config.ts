import type { ConverterConfig } from './types';

//Ye function check karta hai ki diya gaya data ek object hai ya nahi.
//value: unknown Matlab function ko kisi bhi type ka data mil sakta hai.
function isRecord( value: unknown ): value is Record< string, unknown > {
	return typeof value === 'object' && value !== null;
}

/**isRecord() sirf check karta hai ki data object hai.
Lekin isConfig() check karta hai ki object ke andar required properties bhi hain ya nahi. */

function isConfig( value: unknown ): value is ConverterConfig {
	if ( ! isRecord( value ) ) {
		return false;
	}

	//object se value nikali
	const { restUrl, currencies, defaultFrom, defaultTo } = value;

	return (
		typeof restUrl === 'string' &&
		typeof defaultFrom === 'string' &&
		typeof defaultTo === 'string' &&
		Array.isArray( currencies ) &&
		currencies.length > 0 &&
		currencies.every(
			( item ) =>
				isRecord( item ) &&
				typeof item.code === 'string' &&
				typeof item.label === 'string'
		)
	);
}

/**
 * Reads the JSON from the data-config attribute.
 * Returns null when it is missing or has the wrong shape.
 */
export function parseConfig( raw: string | undefined ): ConverterConfig | null {
	//raw: Isme HTML ke data-config ki value aayegi.
	/**string | undefined: Value string bhi ho sakti hai aur undefined bhi.
	ConverterConfig | null: Return mein valid configuration ya null milega. */

	if ( ! raw ) {
		return null;
	}

	try {
		//PHP se jo JSON string aayi thi usko JavaScript object mein convert kar raha hai.
		//Yahan data: unknown ka matlab hai ki parsed data ko abhi trusted configuration nahi maana gaya hai.
		const data: unknown = JSON.parse( raw );
		return isConfig( data ) ? data : null;
	} catch {
		return null;
	}
}