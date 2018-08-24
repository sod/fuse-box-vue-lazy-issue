const {FuseBox, QuantumPlugin, WebIndexPlugin, Sparky, SassPlugin, CSSPlugin, CSSResourcePlugin, VueComponentPlugin, WorkFlowContext} = require('fuse-box');

let isProduction = false;

Sparky.context(() => ({
    create() {
        const fuse = FuseBox.init({
            showErrorsInBrowser: true,
            log: {
                enabled: true,
                showBundledFiles: false,
            },
            hash: isProduction,
            automaticAlias: true,
            useTypescriptCompiler: true,
            homeDir: 'src',
            output: 'dist/$name.js',
            target: 'browser',
            alias: {
                vue: 'vue/dist/vue.min',
            },
            plugins: [
                VueComponentPlugin({
                    style: [
                        SassPlugin({
                            importer: true
                        }),
                        CSSResourcePlugin(),
                        CSSPlugin(),
                    ],
                }),
                CSSPlugin(),
                WebIndexPlugin(),
                isProduction && QuantumPlugin({
                    bakeApiIntoBundle: 'app',
                    treeshake: true,
                    uglify: true,
                    css: true,
                }),
            ]
        });

        const app = fuse.bundle('app')
            .instructions('>App.vue');

        const run = () => fuse.run();

        if (!isProduction) {
            fuse.dev({
                open: true,
                hmr: false,
            });

            app.watch();
        }

        return {fuse, app, run};
    }
}));

Sparky.task('set-production', () => {
    isProduction = true;
});

Sparky.task('copy-font', () => Sparky.src('fonts/*', {base: './node_modules/font-awesome'}).dest("./dist"));
Sparky.task('clean', () => Sparky.src('./dist').clean('dist/'));

const run = (context) => context.create().run();
const tasks = ['clean', 'copy-font'];

Sparky.task('default', [...tasks], run);
Sparky.task('production', ['set-production', ...tasks], run);
