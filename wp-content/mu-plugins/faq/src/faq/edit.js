import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, PlainText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';
import {
	addItem,
	updateItem,
	removeItem,
	reorderItems,
	isItemEmpty,
} from './utils';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { faqs } = attributes;

	// While dragging: { from: index being dragged, over: index it is hovering }.
	const [ dragState, setDragState ] = useState( null );
	const [ confirmIndex, setConfirmIndex ] = useState( null );

	const addFaq = () => {
		setAttributes( { faqs: addItem( faqs ) } );
	};

	const updateFaq = ( index, field, value ) => {
		setAttributes( { faqs: updateItem( faqs, index, field, value ) } );
	};

	const removeFaq = ( index ) => {
		setAttributes( { faqs: removeItem( faqs, index ) } );
		setConfirmIndex( null );
	};

	// Ask for confirmation first, unless the item is completely empty.
	const requestRemove = ( index ) => {
		if ( isItemEmpty( faqs[ index ] ) ) {
			removeFaq( index );
			return;
		}
		setConfirmIndex( index );
	};

	// One function for the buttons and for dragging (any position to any position).
	const reorderFaq = ( from, to ) => {
		const newFaqs = reorderItems( faqs, from, to );
		if ( newFaqs === faqs ) {
			return;
		}
		setAttributes( { faqs: newFaqs } );
		setConfirmIndex( null );
	};

	const moveFaq = ( index, direction ) =>
		reorderFaq( index, index + direction );

	// Pointer-based dragging (mouse, pen and touch), no native drag and drop.
	const handlePointerDown = ( event, index ) => {
		if ( event.button !== 0 ) {
			return;
		}
		event.currentTarget.setPointerCapture( event.pointerId );
		setDragState( { from: index, over: index } );
	};

	const handlePointerMove = ( event ) => {
		if ( ! dragState ) {
			return;
		}
		const container = event.currentTarget.closest(
			'.wp-block-devtask-faq'
		);
		const items = container.querySelectorAll( '.devtask-faq__item' );

		// The hovered item is the last one whose top edge is above the pointer.
		let over = 0;
		items.forEach( ( item, i ) => {
			if ( event.clientY >= item.getBoundingClientRect().top ) {
				over = i;
			}
		} );

		if ( over !== dragState.over ) {
			setDragState( { ...dragState, over } );
		}
	};

	//on leaving mouse
	const handlePointerUp = () => {
		if ( ! dragState ) {
			return;
		}
		reorderFaq( dragState.from, dragState.over );
		setDragState( null );
	};

	return (
		<div { ...blockProps }>
			{ faqs.map( ( faq, index ) => (
				<div
					key={ index }
					className={
						'devtask-faq__item' +
						( dragState && dragState.from === index
							? ' is-drag-source'
							: '' ) +
						( dragState &&
						dragState.over === index &&
						dragState.from !== index
							? ' is-over'
							: '' )
					}
				>
					<div className="devtask-faq__actions">
						<button
							type="button"
							className={
								'devtask-faq__drag-handle' +
								( dragState && dragState.from === index
									? ' is-active'
									: '' )
							}
							onMouseDown={ ( event ) => {
								// Stops the browser and the editor from starting their own drag or selection.
								event.preventDefault();
								event.stopPropagation();
							} }
							onPointerDown={ ( event ) =>
								handlePointerDown( event, index )
							}
							onPointerMove={ handlePointerMove }
							onPointerUp={ handlePointerUp }
							onPointerCancel={ () => setDragState( null ) }
							title={ __( 'Drag to reorder', 'faq' ) }
							tabIndex={ -1 }
							aria-hidden="true"
						>
							⋮⋮
						</button>
						<Button
							variant="secondary"
							size="small"
							onClick={ () => moveFaq( index, -1 ) }
							disabled={ index === 0 }
						>
							{ __( 'Move up', 'faq' ) }
						</Button>
						<Button
							variant="secondary"
							size="small"
							onClick={ () => moveFaq( index, 1 ) }
							disabled={ index === faqs.length - 1 }
						>
							{ __( 'Move down', 'faq' ) }
						</Button>
						{ confirmIndex === index ? (
							<>
								<Button
									variant="primary"
									size="small"
									isDestructive
									onClick={ () => removeFaq( index ) }
								>
									{ __( 'Confirm delete', 'faq' ) }
								</Button>
								<Button
									variant="secondary"
									size="small"
									onClick={ () => setConfirmIndex( null ) }
								>
									{ __( 'Cancel', 'faq' ) }
								</Button>
							</>
						) : (
							<Button
								variant="secondary"
								size="small"
								isDestructive
								onClick={ () => requestRemove( index ) }
							>
								{ __( 'Delete', 'faq' ) }
							</Button>
						) }
					</div>
					<PlainText
						value={ faq.question }
						onChange={ ( value ) =>
							updateFaq( index, 'question', value )
						}
						placeholder={ __( 'Type the question…', 'faq' ) }
						aria-label={ __( 'Question', 'faq' ) }
					/>
					<RichText
						tagName="div"
						value={ faq.answer }
						onChange={ ( value ) =>
							updateFaq( index, 'answer', value )
						}
						placeholder={ __( 'Type the answer…', 'faq' ) }
						aria-label={ __( 'Answer', 'faq' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/link',
						] }
					/>
				</div>
			) ) }
			<Button variant="primary" onClick={ addFaq }>
				{ __( 'Add FAQ', 'faq' ) }
			</Button>
		</div>
	);
}
