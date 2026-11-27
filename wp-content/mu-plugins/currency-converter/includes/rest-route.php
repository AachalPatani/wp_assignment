<?php
/**
 * REST route for the Currency Converter block.
 *
 * @package devtask-currency-converter
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers POST /wp-json/devtask/v1/convert.
 */
function devtask_cc_register_route() {
	$text_arg = array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
	);

	register_rest_route(
		'devtask/v1',
		'/convert',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'devtask_cc_handle_convert',
			'permission_callback' => '__return_true', // Public, read-only endpoint.
			'args'                => array(
				'amount' => $text_arg,
				'from'   => $text_arg,
				'to'     => $text_arg,
			),
		)
	);
}
add_action( 'rest_api_init', 'devtask_cc_register_route' );

/**
 * Handles a conversion request.
 *
 * @param WP_REST_Request $request The request.
 * @return WP_REST_Response|WP_Error
 */
function devtask_cc_handle_convert( WP_REST_Request $request ) {
	$converter = new Devtask_Currency_Converter(
		require __DIR__ . '/currencies.php',
		new Devtask_Rates_Client()
	);

	$result = $converter->convert(
		$request->get_param( 'amount' ),
		$request->get_param( 'from' ),
		$request->get_param( 'to' )
	);

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	return rest_ensure_response( $result );
}