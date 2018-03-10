Package.describe({
    name: 'ipstas:userfeedback',
    version: '0.0.1',
    summary: 'Provides a userfeedback page',
    git: 'https://github.com/ipstas/meteor-userfeedback',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.6.1');
		
		Npm.depends({
			'simpl-schema': '1.1.0',
			github: '0.2.4'
		});

    api.use([
			'mongo',
			'ecmascript',
			'templating@1.3.2',
			'blaze@2.3.2',
			'underscore',
			'aldeed:autoform@6.0.0',
			'peppelg:bootstrap-3-modal@1.0.4'
    ]);
		
		api.addFiles([
			'1main.js',
			//'common/tag.js',
			'common/collection.js',
			'common/hooks.js',
    ], ['server', 'client']);
		
    api.addFiles([
			'server/publish.js',
			'server/methods.js',
    ], 'server');    
		
    api.addFiles([
			'client/userfeedback.html',
			'client/userfeedback.js',
			'client/userfeedback.css',
			'client/modal.html',
			'client/modal.js',
			'client/route.js',
    ], 'client');

    // api.export(['TagsUtil', 'CloudspiderTags']);
});

