const spawn = require("child_process").spawn;
const gulp = require("gulp");
const debug = require('gulp-debug');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const webpack = require("webpack");
const htmlmin = require('gulp-htmlmin');
const webpackConfig = require("./webpack.config.js");
const BrowserSync = require("browser-sync");
const browserSync = BrowserSync.create();

// // "--stepAnalysis",
// // "--templateMetrics",
// // "--templateMetricsHints"
const HUGO = {
  args: {
    default: [],
    preview: [
      "--buildDrafts",
      "--buildExpired",
      "--buildFuture"
    ]
  },
  bin: "./bin/hugo.sh"
};

const PATHS = {
  public: "public",
  html: "public/**/*.html",
  src: "src/**/*",
  site: "site/**/*"
};

const PRODUCTION_NODE_ENV = "production";
function getNodeEnv() {
  return process.env.NODE_ENV || PRODUCTION_NODE_ENV;
}

function runWebpack(cb) {
  const NODE_ENV = getNodeEnv();
  const webpackEnv = {};
  const webpackARGV = {
    "mode": NODE_ENV
  };
  const myConfig = webpackConfig(webpackEnv, webpackARGV);

  return webpack(myConfig, (err, stats) => {
    if (err) throw new PluginError("webpack", err);
    log("[webpack]", stats.toString({
      colors: true
    }));
    cb();
  });
}

function startBrowserSync(cb) {
  browserSync.init({
    browser: "google chrome",
    server: {
      baseDir: PATHS.public
    }
  });
  cb();
}

function watch(cb) {
  gulp.watch(PATHS.src, gulp.series(runWebpack));
  gulp.watch(PATHS.site, gulp.series(hugo));
  cb();
}

function buildSite(cb, options = {}) {
  const defaultArgs = HUGO.args.default;
  const args = defaultArgs.concat(options);
  const NODE_ENV = getNodeEnv();

  return spawn(HUGO.bin, args, {
    env: {
      'NODE_ENV': NODE_ENV
    },
    stdio: "inherit"
  }).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}

function hugo(cb) {
  const hugoArgs = getNodeEnv() === PRODUCTION_NODE_ENV ? [] : HUGO.args.preview;
  return buildSite(cb, hugoArgs);
}

function htmlMinify(cb) {
  const options = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    removeCDATASectionsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeAttributeQuotes: true,
    useShortDoctype: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    removeScriptTypeAttributes: true,
    removeStyleTypeAttributes: true
  };

  return gulp
    .src(PATHS.html)
    .pipe(debug({title: '[html-minify]:'}))
    .pipe(htmlmin(options))
    .pipe(gulp.dest(PATHS.public))
    .on('end', cb);
}

// TODO: `htmlMinify` is not called for watch
const build = gulp.series(
  runWebpack,
  hugo,
  htmlMinify
);
const devServer = gulp.series(build, startBrowserSync, watch);

gulp.task('build', build);
gulp.task('dev-server', devServer);
gulp.task('default', build);