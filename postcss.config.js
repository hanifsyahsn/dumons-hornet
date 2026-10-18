module.exports = {
    plugins: [
        require('postcss-import'),
        require('@tailwindcss/postcss'),
        require('postcss-custom-media'),
        // Plain CSS for older browsers (iOS < 16.5, Chrome < 112, many in-app WebViews), which
        // drop nested rules and `(width > 768px)` media queries, often taking the declaration
        // after them along: flatten nesting, then turn ranges into min-/max-width
        require('postcss-nesting'),
        require('postcss-media-minmax'),
        require('autoprefixer'),
    ]
}
