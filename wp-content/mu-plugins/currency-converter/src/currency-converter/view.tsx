import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { parseConfig } from './config';
import { CurrencyConverterForm } from './form';


//mounts ek collection hai jisme matching HTML elements store hote hain.
function init(): void {
	const mounts = document.querySelectorAll< HTMLElement >(
		'.wp-block-devtask-currency-converter[data-config]'
	);

	//Ye dono values(elements,index) JavaScript automatically provide karti hai. Tumhe manually declare ya pass nahi karna padta.
	mounts.forEach( ( element, index ) => {
		const config = parseConfig( element.dataset.config );

		if ( ! config ) {
			element.textContent = __(
				'The currency converter could not be loaded.',
				'currency-converter'
			);
			return;
		}
	//Ye parent div ko delete nahi karta. Sirf uske andar ke children remove karta hai.
	//Aisa kyun kiya?
	//Kyunki ab React ko isi div ke andar apna UI render karna hai.

		element.replaceChildren();

		createRoot( element ).render(
			<CurrencyConverterForm
				config={ config }
				idPrefix={ `devtask-cc-${ index }` }
			/>
		);
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}