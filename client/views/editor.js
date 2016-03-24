Template.editor.rendered = function() {
	Tracker.autorun(function () {
		if (Meteor.user()){
			var uid = Meteor.userId();
			console.log('Loggined  as  user: ' + uid);
			Meteor.subscribe("sessions", Meteor.userId());
			Meteor.subscribe("editorCache", Meteor.userId());
			
			Meteor.subscribe("snipets", Meteor.userId());
			Meteor.call('initFS', uid);
			Session.set("inited","done");
			
		} else {
			console.log('No more logged');
			Session.set("inited","not");
			//console.log('Leaving account from route: ', Router.current().route.name);
			Router.go('Landing');
				
		}
  	});

}






