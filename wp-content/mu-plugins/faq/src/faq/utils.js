/**
 * Pure helper functions for managing the list of FAQ items.
 * They never change the array they receive and always return a new one.
 */

export const addItem = ( faqs ) => [ ...faqs, { question: '', answer: '' } ];

export const updateItem = ( faqs, index, field, value ) =>
	faqs.map( ( faq, i ) =>
		i === index ? { ...faq, [ field ]: value } : faq
	);

export const removeItem = ( faqs, index ) =>
	faqs.filter( ( _, i ) => i !== index );

/**
 * Moves one item to a new position.
 * Returns the SAME array when nothing should change, so callers can skip the update.
 *
 * @param {Array}  faqs List of FAQ items.
 * @param {number} from Current index of the item.
 * @param {number} to   New index for the item.
 * @return {Array} A new array with the item moved, or the same array if nothing changed.
 */
export const reorderItems = ( faqs, from, to ) => {
	if (
		! Number.isInteger( from ) ||
		! Number.isInteger( to ) ||
		from === to ||
		from < 0 ||
		from >= faqs.length ||
		to < 0 ||
		to >= faqs.length
	) {
		return faqs;
	}
	const newFaqs = [ ...faqs ];
	const [ moved ] = newFaqs.splice( from, 1 );
	newFaqs.splice( to, 0, moved );
	return newFaqs;
};

export const isItemEmpty = ( faq ) =>
	! faq || ( ! faq.question && ! faq.answer );
