<?php
/*
Plugin Name: Gestures HammerJS
Plugin URI: https://github.com/ApolloSSC/gestures-hammerjs
Description: Brings basic gestures to WordPress using HammerJS
Author: Rémy Villain
Version: 1.0
Author URI: www.apollossc.com
*/

/*
 *  Enqueue Gesture Scripts
 */
function gesture_enqueue_scripts() {

	/* only need to enqueue if a single page */
	if ( !is_admin() ) {
	
		// Register the init script
		wp_register_script( 'gestures_init',  plugins_url( 'js/init.js', __FILE__ ), array('jquery'), null, true );
				
		// Now we can localize the script with our data.
		$gestures_array = get_option( 'gestures_hammer_settings' , array('container' => '#page') );
        wp_localize_script( 'gestures_init', 'gestures', $gestures_array );

		// Enqueue the scripts.
        wp_enqueue_script( 'touch-emulator', plugins_url( 'js/touch-emulator.js', __FILE__ ), array('jquery'), null, true );
        wp_enqueue_script( 'hammer', plugins_url( 'js/hammer.min.js', __FILE__ ), array('jquery'), null, true );
        wp_enqueue_script( 'gestures_init' );


        wp_register_style( 'gestures_style', plugins_url('css/style.css', __FILE__ ));
        wp_enqueue_style('gestures_style');

	}
	
}

add_action( 'wp_enqueue_scripts' , 'gesture_enqueue_scripts' );

/* options courtesy of WordPress Settings Generator (http://http://wpsettingsapi.jeroensormani.com/) */

add_action( 'admin_menu', 'gestures_add_admin_menu' );
add_action( 'admin_init', 'gestures_hammer_settings_init' );


function gestures_add_admin_menu(  ) { 

	add_options_page( 'Gestures HammerJS', 'Gestures HammerJS', 'manage_options', 'gestures_comments', 'gestures_comments_options_page' );

}


function gestures_hammer_settings_exist(  ) { 

	if( false == get_option( 'gestures_hammer_settings' ) ) { 

		add_option( 'gestures_hammer_settings' );

	}

}


function gestures_hammer_settings_init(  ) { 

	register_setting( 'gestures_hammer_settings', 'gestures_hammer_settings' );

	add_settings_section(
		'gestures_hammer_settings_section', 
		__( 'Add gesture navigation to your WordPress site', 'gestures' ), 
		'gestures_hammer_settings_section_callback', 
		'gestures_hammer_settings'
	);

	add_settings_field( 
		'container', 
		__( 'Content container identifier (eg #page)', 'gestures' ), 
		'gestures_container_render', 
		'gestures_hammer_settings', 
		'gestures_hammer_settings_section'
	);
    add_settings_field(
        'category_navigation',
        __( 'Category navigation ? (swipe categories)', 'gestures' ),
        'gestures_category_navigation_render',
        'gestures_hammer_settings',
        'gestures_hammer_settings_section'
    );
}


function gestures_container_render(  ) { 

	$options = get_option( 'gestures_hammer_settings' , array('container' => '#page', 'category_navigation' => true ));
	?>
	<input type='text' name='gestures_hammer_settings[container]' value='<?php echo $options['container']; ?>'>
	<?php

}

function gestures_category_navigation_render() {
    $options = get_option( 'gestures_hammer_settings' , array('container' => '#page', 'category_navigation' => 1 ));
    $html = '<input type="checkbox" id="category_navigation" name="gestures_hammer_settings[category_navigation]" value="1"' . checked( 1, $options['category_navigation'], false ) . '/>';
    echo $html;

}


function gestures_hammer_settings_section_callback(  ) { 

	echo __( '<p>Enter the identifier for the container</p>', 'gestures' );

}


function gestures_comments_options_page(  ) { 

	?>
	<form action='options.php' method='post'>
		
		<h2>Gestures HammerJS</h2>
		
		<?php
		settings_fields( 'gestures_hammer_settings' );
		do_settings_sections( 'gestures_hammer_settings' );
		submit_button();
		?>
		
	</form>
	<?php

}

?>