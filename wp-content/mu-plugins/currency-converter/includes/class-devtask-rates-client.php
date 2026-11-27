<?php
/**
 * Fetches exchange rates from the Frankfurter API (server-side only).
 *
 * @package devtask-currency-converter
 */

defined( 'ABSPATH' ) || exit;

/**
 * Gets, validates and caches the exchange rate for one currency pair.
 */
class Devtask_Rates_Client {

	/**
	 * Base URL of the single-pair rate endpoint.
	 */
	const API_URL = 'https://api.frankfurter.dev/v2/rate/';

	/**
	 * How long a fetched rate is cached, in seconds.
	 */
	const CACHE_TTL = HOUR_IN_SECONDS;

	/**
	 * Request timeout, in seconds.
	 */
	const TIMEOUT = 5;

	/**
	 * Returns the latest rate for a currency pair.
	 *
	 * Both codes must already be validated against the supported list.
	 *
	 * @param string $from Source currency code, e.g. USD.
	 * @param string $to   Destination currency code, e.g. INR.
	 * @return array|WP_Error Array with 'rate' (float) and 'date' (string), or WP_Error.
	 */
	public function get_rate( $from, $to ) {
		$cache_key = 'devtask_cc_rate_' . $from . '_' . $to;
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) && isset( $cached['rate'], $cached['date'] ) ) {
			return $cached;
		}

		$response = wp_remote_get(
			self::API_URL . rawurlencode( $from ) . '/' . rawurlencode( $to ),
			array(
				'timeout' => self::TIMEOUT,
				'headers' => array( 'Accept' => 'application/json' ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'rates_unreachable',
				__( 'We could not reach the exchange rate service. Please try again in a moment.', 'currency-converter' ),
				array( 'status' => 503 )
			);
		}

		if ( 200 !== wp_remote_retrieve_response_code( $response ) ) {
			return new WP_Error(
				'rates_api_failure',
				__( 'The exchange rate service is not available right now. Please try again later.', 'currency-converter' ),
				array( 'status' => 502 )
			);
		}

		$data   = json_decode( wp_remote_retrieve_body( $response ), true );
		$result = $this->parse_response( $data, $from, $to );

		if ( null === $result ) {
			return new WP_Error(
				'rates_invalid_response',
				__( 'The exchange rate service returned an unexpected response. Please try again later.', 'currency-converter' ),
				array( 'status' => 502 )
			);
		}

		set_transient( $cache_key, $result, self::CACHE_TTL );

		return $result;
	}

	/**
	 * Checks the decoded API response and extracts the rate.
	 *
	 * @param mixed  $data Decoded JSON.
	 * @param string $from Expected base currency.
	 * @param string $to   Expected quote currency.
	 * @return array|null Array with 'rate' and 'date', or null if invalid.
	 */
	private function parse_response( $data, $from, $to ) {
		if ( ! is_array( $data ) || ! isset( $data['rate'], $data['base'], $data['quote'] ) ) {
			return null;
		}

		if ( $from !== $data['base'] || $to !== $data['quote'] ) {
			return null;
		}

		if ( ! is_int( $data['rate'] ) && ! is_float( $data['rate'] ) ) {
			return null;
		}

		if ( $data['rate'] <= 0 ) {
			return null;
		}

		return array(
			'rate' => (float) $data['rate'],
			'date' => isset( $data['date'] ) && is_string( $data['date'] ) ? sanitize_text_field( $data['date'] ) : '',
		);
	}
}