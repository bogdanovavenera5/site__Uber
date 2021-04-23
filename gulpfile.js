const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');


/* Статический сервер */
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });
    
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

/* компиляция файла из sass в css */
gulp.task('styles', function(){
    /* взять файл по определенному адресу */
    return gulp.src("src/sass/**/*.+(scss|sass)")

        /* компиляция файла */
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))

        /* переименовать файл */
        .pipe(rename({suffix: '.min', prefix: ''}))

        /* для определения какие префиксы нужно использовать ( -webkit, -ms, -o, -moz)*/
        .pipe(autoprefixer())

        /* минимизация файла */
        .pipe(cleanCSS({compatibility: 'ie8'}))

        /* положить файл по определенному адресу */
        .pipe(gulp.dest("dist/css"))

        /* обновление статического сервера */
        .pipe(browserSync.stream());
});

/* следить за изменениями в фалах */
gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch('src/*.html').on("change", gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
    gulp.watch("src/fonts/**/*").on('all', gulp.parallel('fonts'));
    gulp.watch("src/icons/**/*").on('all', gulp.parallel('icons'));
    gulp.watch("src/img/**/*").on('all', gulp.parallel('images'));
})


// сжатие файла .html и перенос в папку dist
gulp.task('html', function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

// сжатие скриптовых файлов и перенос в папку dist
gulp.task('scripts', function() {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

// сжатие файлов fonts и перенос в папку dist
gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.stream());
});

// сжатие файлов icons и перенос в папку dist
gulp.task('icons', function() {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

// сжатие файлов images и перенос в папку dist
gulp.task('images', function() {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
});

/* запуск всех задач одной задачей */
gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'scripts', 'fonts', 'icons', 'images'))
