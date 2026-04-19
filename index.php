<?php
// Fallback for non-homepage templates
get_header(); ?>
<main><div class="container" style="padding: 60px 20px;">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <h1><?php the_title(); ?></h1>
        <div><?php the_content(); ?></div>
    <?php endwhile; endif; ?>
</div></main>
<?php get_footer(); ?>
