/* global describe, it, expect */
import {
	addItem,
	updateItem,
	removeItem,
	reorderItems,
	isItemEmpty,
} from '../utils';

const sample = () => [
	{ question: 'Q1', answer: 'A1' },
	{ question: 'Q2', answer: 'A2' },
	{ question: 'Q3', answer: 'A3' },
	{ question: 'Q4', answer: 'A4' },
];

const questions = ( faqs ) => faqs.map( ( faq ) => faq.question );

describe( 'addItem', () => {
	it( 'appends an empty item at the end', () => {
		const result = addItem( sample() );
		expect( result ).toHaveLength( 5 );
		expect( result[ 4 ] ).toEqual( { question: '', answer: '' } );
	} );

	it( 'works on an empty list', () => {
		expect( addItem( [] ) ).toEqual( [ { question: '', answer: '' } ] );
	} );

	it( 'does not change the original array', () => {
		const faqs = sample();
		addItem( faqs );
		expect( faqs ).toHaveLength( 4 );
	} );
} );

describe( 'updateItem', () => {
	it( 'changes only the chosen field of the chosen item', () => {
		const result = updateItem( sample(), 1, 'question', 'New' );
		expect( result[ 1 ] ).toEqual( { question: 'New', answer: 'A2' } );
		expect( result[ 0 ] ).toEqual( { question: 'Q1', answer: 'A1' } );
		expect( result[ 2 ] ).toEqual( { question: 'Q3', answer: 'A3' } );
	} );

	it( 'can update the answer', () => {
		const result = updateItem( sample(), 0, 'answer', '<b>Bold</b>' );
		expect( result[ 0 ].answer ).toBe( '<b>Bold</b>' );
	} );

	it( 'does not change the original array or item', () => {
		const faqs = sample();
		updateItem( faqs, 1, 'question', 'New' );
		expect( faqs[ 1 ].question ).toBe( 'Q2' );
	} );
} );

describe( 'removeItem', () => {
	it( 'removes the first item', () => {
		expect( questions( removeItem( sample(), 0 ) ) ).toEqual( [
			'Q2',
			'Q3',
			'Q4',
		] );
	} );

	it( 'removes a middle item', () => {
		expect( questions( removeItem( sample(), 2 ) ) ).toEqual( [
			'Q1',
			'Q2',
			'Q4',
		] );
	} );

	it( 'removes the last item', () => {
		expect( questions( removeItem( sample(), 3 ) ) ).toEqual( [
			'Q1',
			'Q2',
			'Q3',
		] );
	} );

	it( 'does not change the original array', () => {
		const faqs = sample();
		removeItem( faqs, 1 );
		expect( faqs ).toHaveLength( 4 );
	} );
} );

describe( 'reorderItems', () => {
	it( 'moves the first item to the last position', () => {
		expect( questions( reorderItems( sample(), 0, 3 ) ) ).toEqual( [
			'Q2',
			'Q3',
			'Q4',
			'Q1',
		] );
	} );

	it( 'moves the last item to the first position', () => {
		expect( questions( reorderItems( sample(), 3, 0 ) ) ).toEqual( [
			'Q4',
			'Q1',
			'Q2',
			'Q3',
		] );
	} );

	it( 'moves a middle item to another middle position', () => {
		expect( questions( reorderItems( sample(), 1, 2 ) ) ).toEqual( [
			'Q1',
			'Q3',
			'Q2',
			'Q4',
		] );
	} );

	it( 'moves one place up and one place down (the Move buttons)', () => {
		expect( questions( reorderItems( sample(), 2, 1 ) ) ).toEqual( [
			'Q1',
			'Q3',
			'Q2',
			'Q4',
		] );
		expect( questions( reorderItems( sample(), 1, 2 ) ) ).toEqual( [
			'Q1',
			'Q3',
			'Q2',
			'Q4',
		] );
	} );

	it( 'keeps every item exactly once', () => {
		const result = reorderItems( sample(), 0, 2 );
		expect( [ ...questions( result ) ].sort() ).toEqual( [
			'Q1',
			'Q2',
			'Q3',
			'Q4',
		] );
	} );

	it( 'returns the same array when from and to are equal', () => {
		const faqs = sample();
		expect( reorderItems( faqs, 2, 2 ) ).toBe( faqs );
	} );

	it( 'returns the same array for out of range positions', () => {
		const faqs = sample();
		expect( reorderItems( faqs, -1, 2 ) ).toBe( faqs );
		expect( reorderItems( faqs, 0, 4 ) ).toBe( faqs );
		expect( reorderItems( faqs, 4, 0 ) ).toBe( faqs );
	} );

	it( 'returns the same array for non-integer positions', () => {
		const faqs = sample();
		expect( reorderItems( faqs, null, 1 ) ).toBe( faqs );
		expect( reorderItems( faqs, 0, undefined ) ).toBe( faqs );
		expect( reorderItems( faqs, NaN, 1 ) ).toBe( faqs );
	} );

	it( 'does not change the original array', () => {
		const faqs = sample();
		reorderItems( faqs, 0, 3 );
		expect( questions( faqs ) ).toEqual( [ 'Q1', 'Q2', 'Q3', 'Q4' ] );
	} );
} );

describe( 'isItemEmpty', () => {
	it( 'is true when question and answer are both empty', () => {
		expect( isItemEmpty( { question: '', answer: '' } ) ).toBe( true );
	} );

	it( 'is false when there is a question or an answer', () => {
		expect( isItemEmpty( { question: 'Q', answer: '' } ) ).toBe( false );
		expect( isItemEmpty( { question: '', answer: 'A' } ) ).toBe( false );
	} );

	it( 'is true for a missing item', () => {
		expect( isItemEmpty( undefined ) ).toBe( true );
	} );
} );
