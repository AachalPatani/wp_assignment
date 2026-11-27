<?php
/**
 * Currency conversion logic for the Currency Converter block.
 *
 * @package devtask-currency-converter
 */

defined( 'ABSPATH' ) || exit;

/**
 * Validates and (in later steps) converts currency amounts.
 */
class Devtask_Currency_Converter {

		/**
	 * Supported currencies, keyed by ISO 4217 code.
	 *
	 * @var array
	 */
	private $currencies;

	/**
	 * Client that fetches exchange rates.
	 *
	 * @var Devtask_Rates_Client
	 */
	private $rates;

	/**
	 * Constructor.
	 *
	 * @param array                $currencies Supported currencies (see includes/currencies.php).
	 * @param Devtask_Rates_Client $rates      Exchange rates client.
	 */
	public function __construct( array $currencies, Devtask_Rates_Client $rates ) {
		$this->currencies = $currencies;
		$this->rates      = $rates;
	}

	/**
	 * Validates the user input.
	 *
	 * @param mixed $amount Raw amount from the request.
	 * @param mixed $from   Raw source currency code.
	 * @param mixed $to     Raw destination currency code.
	 * @return array|WP_Error Clean values on success, WP_Error on failure.
	 */
	public function validate( $amount, $from, $to ) {
		$from = $this->normalise_code( $from );
		$to   = $this->normalise_code( $to );

		if ( ! isset( $this->currencies[ $from ] ) ) {
			return $this->error( 'unsupported_from', __( 'Please choose a supported currency to send from.', 'currency-converter' ) );
		}

		if ( ! isset( $this->currencies[ $to ] ) ) {
			return $this->error( 'unsupported_to', __( 'Please choose a supported currency to send to.', 'currency-converter' ) );
		}

		if ( $from === $to ) {
			return $this->error( 'same_currency', __( 'Please choose two different currencies.', 'currency-converter' ) );
		}

		$clean_amount = $this->validate_amount( $amount );

		if ( is_wp_error( $clean_amount ) ) {
			return $clean_amount;
		}

		return array(
			'amount' => $clean_amount,
			'from'   => $from,
			'to'     => $to,
		);
	}

    	/**
	 * Validates the input, fetches the rate and returns the conversion result.
	 *
	 * @param mixed $amount Raw amount from the request.
	 * @param mixed $from   Raw source currency code.
	 * @param mixed $to     Raw destination currency code.
	 * @return array|WP_Error
	 */
	public function convert( $amount, $from, $to ) {
		$input = $this->validate( $amount, $from, $to );

		if ( is_wp_error( $input ) ) {
			return $input;
		}

		$rate = $this->rates->get_rate( $input['from'], $input['to'] );

		if ( is_wp_error( $rate ) ) {
			return $rate;
		}

		$converted = round( (float) $input['amount'] * $rate['rate'], $this->currencies[ $input['to'] ]['decimals'] );

		if ( ! is_finite( $converted ) ) {
			return $this->error( 'invalid_amount', __( 'Please enter a valid number, for example 100 or 100.50.', 'currency-converter' ) );
		}

		return array(
			'from'                => $input['from'],
			'to'                  => $input['to'],
			'amount'              => $input['amount'],
			'converted'           => $converted,
			'rate'                => $rate['rate'],
			'rate_date'           => $rate['date'],
			'amount_formatted'    => $this->format_money( (float) $input['amount'], $input['from'] ),
			'converted_formatted' => $this->format_money( $converted, $input['to'] ),
			'rate_formatted'      => $this->format_rate( $rate['rate'] ),
		);
	}

	/**
	 * Formats an amount with its currency symbol and decimals.
	 *
	 * @param float  $value Amount.
	 * @param string $code  Currency code (already validated).
	 * @return string
	 */
	private function format_money( $value, $code ) {
		$currency = $this->currencies[ $code ];
		$number   = number_format( $value, $currency['decimals'], '.', ',' );
		$symbol   = $currency['symbol'];
		$gap      = ctype_alpha( $symbol ) ? ' ' : '';

		return $symbol . $gap . $number;
	}

	/**
	 * Formats an exchange rate: up to 6 decimals, trailing zeros removed.
	 *
	 * @param float $rate Exchange rate.
	 * @return string
	 */
	private function format_rate( $rate ) {
		return rtrim( rtrim( number_format( $rate, 6, '.', '' ), '0' ), '.' );
	}

	/**
	 * Validates the amount and returns it as a clean string.
	 *
	 * @param mixed  $amount Raw amount.
	 * @param string $code   Source currency code (already validated).
	 * @return string|WP_Error
	 */
	/**
	 * Validates the amount and returns it as a clean string.
	 *
	 * @param mixed $amount Raw amount.
	 * @return string|WP_Error
	 */
	private function validate_amount( $amount ) {
		if ( is_int( $amount ) || is_float( $amount ) ) {
			$amount = (string) $amount;
		}

		if ( ! is_string( $amount ) ) {
			return $this->error( 'invalid_amount', __( 'Please enter a valid number, for example 100 or 100.50.', 'currency-converter' ) );
		}

		$amount = trim( $amount );

		if ( '' === $amount ) {
			return $this->error( 'empty_amount', __( 'Please enter an amount.', 'currency-converter' ) );
		}

		if ( ! preg_match( '/^-?\d+(\.\d+)?$/', $amount ) ) {
			return $this->error( 'invalid_amount', __( 'Please enter a valid number, for example 100 or 100.50.', 'currency-converter' ) );
		}

		$value = (float) $amount;

		if ( $value < 0 ) {
			return $this->error( 'negative_amount', __( 'The amount cannot be negative.', 'currency-converter' ) );
		}

		if ( 0.0 === $value ) {
			return $this->error( 'zero_amount', __( 'The amount must be greater than zero.', 'currency-converter' ) );
		}

		return $amount;
	}

	/**
	 * Turns a raw value into an upper-case currency code.
	 *
	 * The result is only ever compared against the allow-list, so it
	 * never reaches output or the database unchecked.
	 *
	 * @param mixed $code Raw value.
	 * @return string
	 */
	private function normalise_code( $code ) {
		return is_string( $code ) ? strtoupper( trim( $code ) ) : '';
	}

	/**
	 * Builds a WP_Error with an HTTP 400 status for the REST API.
	 *
	 * @param string $code    Machine-readable error code.
	 * @param string $message User-friendly message.
	 * @return WP_Error
	 */
	private function error( $code, $message ) {
		return new WP_Error( $code, $message, array( 'status' => 400 ) );
	}
}