<?php
/**
 * Server-side render for the Currency Converter block.
 *
 * Outputs a mount point. The TypeScript view script renders the form into it.
 *
 * @package devtask-currency-converter
 */

defined( 'ABSPATH' ) || exit;

$devtask_cc_currencies = require dirname( __DIR__, 2 ) . '/includes/currencies.php';

$devtask_cc_options = array();
foreach ( $devtask_cc_currencies as $devtask_cc_code => $devtask_cc_currency ) {
	$devtask_cc_options[] = array(
		'code'  => $devtask_cc_code,
		'label' => $devtask_cc_currency['country'] . ' - ' . $devtask_cc_code,
	);
}

//this array is for typescript frontend required information
$devtask_cc_config = array(
	'restUrl'     => esc_url_raw( rest_url( 'devtask/v1/convert' ) ),
	'currencies'  => $devtask_cc_options,
	'defaultFrom' => 'USD',
	'defaultTo'   => 'INR',
);
?>
<div <?php echo get_block_wrapper_attributes(); ?> data-config="<?php echo esc_attr( wp_json_encode( $devtask_cc_config ) ); ?>">
	<p><?php esc_html_e( 'Loading currency converter…', 'currency-converter' ); ?></p>
	<noscript>
		<p><?php esc_html_e( 'Please enable JavaScript to use the currency converter.', 'currency-converter' ); ?></p>
	</noscript>
</div>