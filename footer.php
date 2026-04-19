<!-- ========================
     FOOTER
======================== -->
<footer class="site-footer" role="contentinfo">
    <div class="container">
        <div class="footer-logo">
            <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
                MDRN<span style="color:var(--accent);">.</span>
            <?php endif; ?>
        </div>
        
        <div class="footer-grid">
            <?php 
            $footer_cols = get_field('footer_columns', 'option');
            if ($footer_cols) : 
                foreach ($footer_cols as $col) : ?>
                    <div class="footer-col" role="navigation" aria-label="<?php echo esc_attr($col['title']); ?>">
                        <h3 class="footer-col__title"><?php echo esc_html($col['title']); ?></h3>
                        <?php if ($col['links']) : ?>
                            <ul class="footer-col__list">
                                <?php foreach ($col['links'] as $link_item) : 
                                    $link = $link_item['link']; ?>
                                    <li><a href="<?php echo esc_url($link['url']); ?>" target="<?php echo esc_attr($link['target'] ?: '_self'); ?>">
                                        <?php echo esc_html($link['title']); ?>
                                    </a></li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                <?php endforeach;
            endif; ?>
        </div>

        <div class="footer-bottom">
            <?php $socials = get_field('social_links', 'option');
            if ($socials) : ?>
                <div class="footer-socials">
                    <?php foreach ($socials as $social) : ?>
                        <a href="<?php echo esc_url($social['url']); ?>" class="footer-social" target="_blank" rel="noopener noreferrer">
                            <?php echo esc_html($social['platform']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <?php $payments = get_field('payment_icons', 'option');
            if ($payments) : ?>
                <div class="footer-payments" aria-label="Accepted payments">
                    <?php foreach ($payments as $payment) : ?>
                        <span><?php echo esc_html($payment['name']); ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <p class="footer-copy"><?php echo esc_html(get_field('footer_copyright', 'option') ?: '© ' . date('Y') . ' MDRN Store. All Rights Reserved.'); ?></p>
        </div>
    </div>
</footer>

</div><!-- #page -->
<?php wp_footer(); ?>
</body>
</html>
