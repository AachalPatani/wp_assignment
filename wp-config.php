<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'task 1' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'rEqCi;G_^N`tEHH%1.vW$Q&nd?vy-3]Z?@T1_;nW3/ohxVJA_V/ +(=!LARq;gOo' );
define( 'SECURE_AUTH_KEY',  '6v6x !r@<AoXmWt*OhF#WEI;b7i`XZM&(NcsbzVe0x@I9qZQUp#A}AyfNp!rczgk' );
define( 'LOGGED_IN_KEY',    'T)[=e~spCE#jnqo1X|k]&F787,r!^x5C.K}!9G7*#yU 9~4`J~FAeI80{{ky2JM=' );
define( 'NONCE_KEY',        'Xw^,0_}`X+p/9]`mW7$<dL#E&JFv`lZ+|uX#! GAfh5TIX~0e4TGmPW~r]>B,Pvb' );
define( 'AUTH_SALT',        'dZRlucCm~R9-9uf9,+kzGX17:KP3V7&Fk[B9j_Rm[F@LQW0mN2`F=~9)V;igb~?i' );
define( 'SECURE_AUTH_SALT', 'N|5pE],atRhX#xPjt8W*nsr!pwh#y(Y4aX,9Y)BrxcFgln,?aWb#VB4iYA[!YUn-' );
define( 'LOGGED_IN_SALT',   '|a;I2YcVx+g8HAJqHOw-`vldetoD|/e>e>KO?7O}Gy1=rOy?AF@BDa4j]M$qM!PW' );
define( 'NONCE_SALT',       'o80N[+ Yk1$O.?dk6{YshfDkBBkY.Sj`-h0(NBZBRr|/E?0Xq~Y5N?PXOgjI4&~;' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */

/* Add any custom values between this line and the "stop editing" line. */

define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
