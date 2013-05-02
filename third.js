require([
"cdot",

// Libs
"jquery",
"backbone",

// Modules
"modules/activity",
"modules/index",
"modules/common",
"modules/project",
"modules/environment",
"modules/action",
"modules/login",
"modules/projectEvents",
"modules/metering",
//Extra non-namespace libs
"bootstrap",

//Plugins
"jquery_validate",
"jquery_cookie"

],

function (cdot, $, Backbone, Activity, Index, Common, Project, Environment, Action, Login, ProjectEvents, Metering) {
	//Any initialization code goes here
	//Updating the file

	/*
	new Index.Router();
	new Activity.Router();
	new Project.Router();
	new Environment.Router();


	Backbone.history.start({
	pushState: true
	});
	*/

	var app = cdot.app;

	app.Router = Backbone.Router.extend({
		routes: {
			'index/': 'index',
			'help/': 'cdothelp',
			'': 'login',
			'error/': 'error',
			'ieError/': 'ieError',
			'about-cdot/': 'aboutcdot',
			'cdot-ops/': 'cdotops',
			'inside/': 'inside',
			'team/': 'team',
			'known-issues/': 'knownissues',
			'release-notes/': 'releasenotes',
			':id/': 'project',
			':project/environment/:environment/': 'environment',
			':project/events/': 'events',
			':project/ssotemp/': 'project',
			':project/metering/': 'metering',
            'logout/': 'logout'
		},
		index: function () {
			if (Common.checkCookieValidityNoRedirect()) {
				Index.loadProjects();
			} else {
				$.cookie("unloadTime", null, { path: '/', domain: Login.COOKIE_DOMAIN });
				Login.register();
			}
		},
		cdothelp: function () {
			//do nothing
		},
		login: function () {
			Login.register();
		},
		error: function () {
		},
		ieError: function () {
		},
		aboutcdot: function () {
		},
		cdotops: function () {
		},
		inside: function () {
		},
		team: function () {
		},
		knownissues: function () {
		},
		releasenotes: function () {
		},
		logout: function () {
		},
		project: function (projectId) {
			if (Common.checkCookieValidityNoRedirect()) {
				Project.loadProject(projectId);
				Activity.loadActivities(projectId);
                setInterval(function () {
				Project.loadNowRunning(projectId);
				}, 10000);
				setInterval(function () {
					Project.loadActivities();
				}, 50 * 1000);
				setInterval(function () {
					Project.loadEnvironments();
                }, 2 * 60 * 1000);
                app.getEvents(projectId);
			} else {
				$.cookie("unloadTime", null, { path: '/', domain: Login.COOKIE_DOMAIN });
				Login.register();
			}
		},
		events: function (projectId) {
			if (Common.checkCookieValidityNoRedirect()) {
				ProjectEvents.loadProject(projectId);
				setInterval(function () {
					ProjectEvents.loadSideNavBar();
				}, 2 * 60 * 1000);
				app.getEvents(projectId);
			} else {
				$.cookie("unloadTime", null, { path: '/', domain: Login.COOKIE_DOMAIN });
				Login.register();
			}
		},
		metering: function (projectId) {
			if (Common.checkCookieValidityNoRedirect()) {
				Metering.loadProject(projectId);
				app.getEvents(projectId);
			} else {
				$.cookie("unloadTime", null, { path: '/', domain: Login.COOKIE_DOMAIN });
				Login.register();
			}
		},
		environment: function (project, environment) {
			if (Common.checkCookieValidityNoRedirect()) {
				Environment.loadEnvironments(project, environment);
				Action.loadActions(project, environment, "RUNNING");
				setInterval(function () {
					Environment.loadNowRunning();
				}, 10000);
				setInterval(function () {
					Environment.loadTopology();
					Environment.loadSideNavBar();
				}, 2 * 60 * 1000);
				app.getEvents(project);
			} else {
				$.cookie("unloadTime", null, { path: '/', domain: Login.COOKIE_DOMAIN });
				Login.register();
			}
		}
	});
	app.getEvents = function (project) {
		if (ENABLE_USER_GENERATED_EVENTS) {
			ProjectEvents.getEvents(project, "", "", "");
			setInterval(function () {
				ProjectEvents.getEvents(project, "", "", "");
			}, 30 * 1000);
		}
	}
	$(function () {
		app.router = new app.Router();
		Backbone.history.start({
			pushState: true
		});
		Login.setLogoutOption();
		Login.extendLogin();
		$(window).unload(function () {
			if (window.location.pathname !== "/"
					&& window.location.pathname !== "/help/"
					&& window.location.pathname !== "/about-cdot/"
					&& window.location.pathname !== "/cdot-ops/"
					&& window.location.pathname !== "/team/"
					&& window.location.pathname !== "/inside/"
					&& window.location.pathname !== "/known-issues/"
					&& window.location.pathname !== "/release-notes/"
					&& $.cookie('logout') === null) {
				$.cookie('unloadTime', new Date().getTime(), { path: '/' });
			} else {
				$.cookie('logout', null, { path: '/' });
				$.cookie('unloadTime', null, { path: '/' });
			}
		});
		setInterval(function () {
			Login.extendLogin();
		}, 10 * 60 * 1000);
		if (window.location.hash) {
			$(window.location.hash).tab('show');
		}

	});



});
