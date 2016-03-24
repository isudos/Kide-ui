Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  //this.route('Landing', {path: '/'});
	this.route('editor', {path: '/editor',
		waitOn: function(){
    		// waitOn makes sure that this publication is ready before rendering your template
    		return [Meteor.subscribe("fileTrees"),Meteor.subscribe("sessions"),Meteor.subscribe("editorCache")];
  		}
	});

  this.route('Landing', {
	  path: '/',
	  onBeforeAction: function () {
	    if (! Meteor.user()) {
	      if (Meteor.loggingIn()) {
	      	Router.go('editor');
	      }
	      else{
	      	this.next();
	        
	      }
	    } else {
	    	this.render('Landing');
	    }
	  }
	});

	
});