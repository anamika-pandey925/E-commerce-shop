<?php
/**
 * MDRN Store — functions.php
 */

// --- Theme Setup ---
function mdrn_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'custom-logo', array( 'height' => 60, 'width' => 160 ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-list', 'gallery', 'caption' ) );
}
add_action( 'after_setup_theme', 'mdrn_setup' );

// --- Enqueue Styles & Scripts ---
function mdrn_scripts() {
    // Google Fonts: Inter
    wp_enqueue_style( 'mdrn-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', array(), null );
    // Theme stylesheet
    wp_enqueue_style( 'mdrn-style', get_stylesheet_uri(), array(), '2.0.0' );
    // Main CSS (all components)
    wp_enqueue_style( 'mdrn-main', get_template_directory_uri() . '/assets/css/main.css', array( 'mdrn-style' ), '2.0.0' );
    // Main JS
    wp_enqueue_script( 'mdrn-js', get_template_directory_uri() . '/assets/js/main.js', array(), '2.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'mdrn_scripts' );

// --- ACF Options Page ---
if ( function_exists( 'acf_add_options_page' ) ) {
    acf_add_options_page( array(
        'page_title' => 'Store Settings',
        'menu_title' => 'Store Settings',
        'menu_slug'  => 'mdrn-store-settings',
        'capability' => 'edit_posts',
        'redirect'   => false,
    ) );
}

// --- Include ACF Field Registration ---
require get_template_directory() . '/inc/acf-fields.php';
