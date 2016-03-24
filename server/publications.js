Meteor.publish("fileTrees", function(){
		return FileTrees.find({userId:  this.userId});
});

Meteor.publish("editorCache", function(){
		return EditorCache.find({userId:  this.userId});
});

Meteor.publish("sessions", function(){
		return Sessions.find({userId:  this.userId});
});

