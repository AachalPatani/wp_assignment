<?php
/**
 * Frontend output for the devtask/faq block.
 *
 * @package devtask-faq
 *
 * Available variables: $attributes, $content, $block.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$faqs = ( isset( $attributes['faqs'] ) && is_array( $attributes['faqs'] ) )
	? $attributes['faqs']
	: array();

if ( empty( $faqs ) ) {
	return;
}
?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php foreach ( $faqs as $faq ) : ?>
		<?php
		if ( ! is_array( $faq ) ) {
			continue;
		}

		// Question: plain text. Invalid UTF-8 is removed, tags are kept as literal text.
		$question = ( isset( $faq['question'] ) && is_string( $faq['question'] ) )
			? trim( wp_check_invalid_utf8( $faq['question'] ) )
			: '';

		// Answer: rich text, filtered on output with wp_kses_post().
		$answer = ( isset( $faq['answer'] ) && is_string( $faq['answer'] ) )
			? $faq['answer']
			: '';

		if ( '' === $question ) {
			continue;
		}
		?>
		<details class="devtask-faq__item">
			<summary class="devtask-faq__question"><?php echo esc_html( $question ); ?></summary>
			<div class="devtask-faq__answer"><?php echo wp_kses_post( $answer ); ?></div>
		</details>
	<?php endforeach; ?>
</div>