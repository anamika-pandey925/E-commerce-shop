<?php get_header(); ?>

<main id="primary" class="site-main">
    <?php while ( have_posts() ) : the_post(); ?>
        <?php get_template_part( 'template-parts/content', 'hero' ); ?>
        <?php get_template_part( 'template-parts/content', 'brands' ); ?>
        <?php get_template_part( 'template-parts/content', 'trust' ); ?>
        <?php get_template_part( 'template-parts/content', 'collections' ); ?>
        <?php get_template_part( 'template-parts/content', 'new-arrivals' ); ?>
        <?php get_template_part( 'template-parts/content', 'newsletter' ); ?>
        <?php get_template_part( 'template-parts/content', 'reviews' ); ?>
        <?php get_template_part( 'template-parts/content', 'story' ); ?>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
