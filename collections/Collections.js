Code = new Mongo.Collection("code");
FileTrees = new Mongo.Collection("fileTrees");
EditorCache = new Mongo.Collection("editorCache");
Sessions = new Mongo.Collection("sessions");

Snipets = new Mongo.Collection("snippets");

EditorCache.allow(
{update: function(userId, file, fields, content){
	return true;
},
insert: function(userId,  file){
	return true;
},
remove: function(userId,  file){
	return true;
},

});


Sessions.allow(
{update: function(userId, file, fields, content){
	return true;
},
insert: function(userId,  file){
	return true;
},
remove: function(userId,  file){
	return true;
},

});