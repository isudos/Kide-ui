Package.describe({
    summary: "Provides jstree tree control to meteor"
});

Package.on_use(function (api) {
    api.use('jquery', 'client');

    api.add_files('lib/dist/themes/default/32px.png'    , 'client');
    api.add_files('lib/dist/themes/default/40px.png'    , 'client');
    api.add_files('lib/dist/themes/default/throbber.gif', 'client');
    api.add_files('lib/dist/themes/default/style.css'   , 'client');
    api.add_files('lib/dist/themes/default/style.min.css'   , 'client');

    api.add_files('lib/dist/jstree.min.js'            , 'client');
    api.add_files('lib/dist/jstree.js'                  , 'client');

    api.add_files('jstree-override.css'                 , 'client');
});