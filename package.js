Package.describe({
	name: 'ipstas:userfeedback',
	version: '0.0.9',
	summary: 'Provides a userfeedback page',
	git: 'https://github.com/ipstas/meteor-userfeedback',
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.versionsFrom('1.8');
	
	// api.mainModule('common.js', ['client', 'server'], { lazy: true });
	// api.mainModule('server.js', ['server'], { lazy: true });
	// api.mainModule('index.js', ['client'], { lazy: true });	
	api.mainModule('common.js', ['client', 'server']);
	api.mainModule('server.js', ['server']);
	api.mainModule('index.js', ['client']);
	
	Npm.depends({
		//'simpl-schema': '1.5.5',
		//github: '0.2.4',
		'bootstrap-tagsinput': '0.7.1'
	});

	api.use([
		'ecmascript',
		'mongo',
		'underscore',
		'templating@1.3.0',
		'blaze@2.3.0',
		'aldeed:autoform@6.0.0',
		'gadicohen:sitemaps@0.0.26',
		'reywood:publish-composite@1.7.0'
	]);		
	
	api.addFiles([
		'client/userfeedback.css',
	], 'client');

	// api.export(['TagsUtil', 'CloudspiderTags']);
});

