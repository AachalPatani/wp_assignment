<?php
/**
 * Supported currencies for the Currency Converter block.
 *
 * Each key is an ISO 4217 currency code. `decimals` is the number of
 * minor-unit digits (ISO 4217), e.g. JPY has 0 and KWD has 3.
 *
 * This list is used for the dropdowns AND for the "unsupported
 * currency" validation, so there is only one source of truth.
 *
 * @package devtask-currency-converter
 */

defined( 'ABSPATH' ) || exit;

return array(
	'USD' => array( 'country' => 'United States', 'name' => 'US Dollar',          'symbol' => '$',   'decimals' => 2 ),
	'INR' => array( 'country' => 'India',         'name' => 'Indian Rupee',       'symbol' => '₹',   'decimals' => 2 ),
	'EUR' => array( 'country' => 'Eurozone',      'name' => 'Euro',               'symbol' => '€',   'decimals' => 2 ),
	'GBP' => array( 'country' => 'United Kingdom', 'name' => 'British Pound',     'symbol' => '£',   'decimals' => 2 ),
	'JPY' => array( 'country' => 'Japan',         'name' => 'Japanese Yen',       'symbol' => '¥',   'decimals' => 0 ),
	'AUD' => array( 'country' => 'Australia',     'name' => 'Australian Dollar',  'symbol' => 'A$',  'decimals' => 2 ),
	'CAD' => array( 'country' => 'Canada',        'name' => 'Canadian Dollar',    'symbol' => 'C$',  'decimals' => 2 ),
	'CHF' => array( 'country' => 'Switzerland',   'name' => 'Swiss Franc',        'symbol' => 'CHF', 'decimals' => 2 ),
	'CNY' => array( 'country' => 'China',         'name' => 'Chinese Yuan',       'symbol' => 'CN¥', 'decimals' => 2 ),
	'SGD' => array( 'country' => 'Singapore',     'name' => 'Singapore Dollar',   'symbol' => 'S$',  'decimals' => 2 ),
	'NZD' => array( 'country' => 'New Zealand',   'name' => 'New Zealand Dollar', 'symbol' => 'NZ$', 'decimals' => 2 ),
	'ZAR' => array( 'country' => 'South Africa',  'name' => 'South African Rand', 'symbol' => 'R',   'decimals' => 2 ),
	'SEK' => array( 'country' => 'Sweden',        'name' => 'Swedish Krona',      'symbol' => 'kr',  'decimals' => 2 ),
	'KRW' => array( 'country' => 'South Korea',   'name' => 'South Korean Won',   'symbol' => '₩',   'decimals' => 0 ),
	'AED' => array( 'country' => 'United Arab Emirates', 'name' => 'UAE Dirham',  'symbol' => 'AED', 'decimals' => 2 ),
	'KWD' => array( 'country' => 'Kuwait',        'name' => 'Kuwaiti Dinar',      'symbol' => 'KWD', 'decimals' => 3 ),
);