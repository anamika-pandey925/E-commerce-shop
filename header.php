<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php
// --- Marquee ---
get_template_part( 'template-parts/content', 'marquee' );

// --- Announcement Bar ---
$announcement = get_field( 'announcement_bar_text', 'option' );
if ( $announcement ) : ?>
<div class="announcement-bar">
    <span class="announcement-bar__dot"></span>
    <?php echo esc_html( $announcement ); ?>
    <span class="announcement-bar__dot"></span>
</div>
<?php endif; ?>

<!-- Header -->
<header class="site-header">
    <div class="container site-header__inner">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo">
            <?php
            if ( has_custom_logo() ) :
                the_custom_logo();
            else :
            ?>
                MDRN<span>.</span>
            <?php endif; ?>
        </a>
        <div class="site-header__actions">
            <button class="icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button class="icon-btn" aria-label="Cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </button>
        </div>
    </div>
</header>

<?php
// --- Category Navigation ---
$category_chips = get_field( 'category_chips', 'option' );
if ( $category_chips ) : ?>
<nav class="category-nav" aria-label="Product categories">
    <div class="category-nav__inner">
        <?php foreach ( $category_chips as $chip ) : ?>
            <a href="<?php echo esc_url( $chip['link']['url'] ); ?>" 
               class="category-chip <?php echo $chip['is_active'] ? 'category-chip--active' : ''; ?>">
                <?php echo esc_html( $chip['label'] ); ?>
            </a>
        <?php endforeach; ?>
    </div>
</nav>
<?php endif; ?>

