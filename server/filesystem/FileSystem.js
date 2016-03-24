Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

function getChildNode(tree, node){
		//console.log("Children: ", tree.children);
		if (tree.children == null){
			tree.children = []
		} else if (tree.children.length > 0){
			for(var  i = 0; i < tree.children.length; i++){
				//console.log("Child: ", tree.children[i].text);
				if(tree.children[i].text.trim() == node.trim()){
					return tree.children[i];
				}
			}
		}
	return null;
}

function hangPath(tree, path_array, level){
	var node = tree;
	for (var i = level; i < path_array.length-1; i++) {
		var newNode = {text: path_array[i], type: "directory", icon: "/folder1.png", children: []}; 
		console.log(node);
		console.log(i,level, path_array.length);
		node.children.push(newNode);
		node = newNode;
	};
	var fid = level.toString() + "_" + guid();
	node.children.push({text: path_array[path_array.length-1], icon: "/file.png", path: ['/', path_array.join('/')].join(''), type: "file", children: [], fid: fid});
	return fid;
}




function insertIntoFS(tree, path_array, level){
		var p = path_array[level];
		var child = getChildNode(tree, p);
		if (level < path_array.length-1 && null != child){
			return insertIntoFS(child, path_array, level + 1);
		} else if (null == child) {
			return hangPath(tree, path_array, level);
		} else {
			return child.fid;
		}
}



function findFileId(tree, path_array, level){
		var p = path_array[level];
		var child = getChildNode(tree, p);
		//console.log("Tree Level: ", tree, p)
		//console.log("Child node: ", child, p, level)
		
		if (level < path_array.length-1 && null != child){
			return findFileId(child, path_array, level + 1);
		} else if (path_array.length - 1 == level && child.type == 'file' ) {
			return child.fid;
		} else {
			return null;
		}

}



Meteor.methods({

		initFS: function(userId){
			var root = FileTrees.findOne({userId: userId, text: "/"});
			if (root == null){
				//init File System
				FileTrees.insert({userId: userId, text: "/", 
				type: 'directory', children:[], icon: '/folder1.png', id: "0-0-0"});
				//init Editor Cache
			    //new_id = EditorCache.insert({userId: userId, fileName: '/newfile.txt', content: ' '});
				//init Sessions
				Sessions.insert({userId: userId, currentTab: 0, tabs: []});		
				Meteor.call('createNewLocalDoc', userId,'/newfile.txt');
			}
		},


		createNewLocalDoc: function(userId, fileName, content){
			var  newId = EditorCache.insert({userId: userId, fileName: fileName,  content: content});
			var userSession = Sessions.findOne({userId: userId});
			userSession.tabs.push({fileName: fileName, cacheId:newId });
			Sessions.update({userId: userId},{$set: {userId: userId, tabs:userSession.tabs }});
			return userSession.tabs.length;
		},


		closeTab: function(userId,order){
			var userSession = Sessions.findOne({userId: userId});
			//for (var i = order; i < userSession.tabs.length - 1 ; i++) {
			//	userSession.tabs[i] = userSession.tabs[i+1];
			//};
			if (userSession.tabs.length > 1){
				console.log("closeTab: lenght before:" , userSession.tabs.length);
				//delete userSession.tabs[userSession.tabs.length - 1];
				console.log("Closing tab: ", order);
				userSession.tabs.splice(order,1);
				console.log("closeTab: lenght after:" , userSession.tabs.length);
				var currentTab = userSession.currentTab;
				
				if (currentTab >= userSession.tabs.length) {
					currentTab = userSession.tabs.length-1;
				} else {
					if (currentTab == order){
						if (currentTab > 0){
							currentTab = currentTab -1;
						} else {
							currentTab = currentTab + 1;
						}
					} 
				}
				Sessions.upsert({userId: userId},{$set: {userId: userId, tabs:userSession.tabs, currentTab:currentTab }});
			}

		},

		switchTab: function(userId, orderFrom,thisOrder, content){
			var userSession = Sessions.findOne({userId: userId});
			console.log("Switching tabs: ", orderFrom, thisOrder);
			var cacheId = userSession.tabs[orderFrom].cacheId;
			EditorCache.update({_id: cacheId}, {$set: {content: content}});
			Sessions.update({userId: userId},{$set: {currentTab: thisOrder}});

		},


		saveAs: function (userId, path, content){
			//Code.insert({path: path, content: content});
			var fs = FileTrees.findOne({userId: userId});
			var path_array = path.trim().split('/');
			console.log(path_array);

			path_array.clean("");
			path_array.clean(null);
			path_array.clean(undefined);
                        
			var fid = insertIntoFS(fs, path_array, 0);
			FileTrees.upsert({_id: fs._id},fs);
			Code.upsert({id: fid}, {content: content, id: fid });		
		},

		save: function (userId, path, content){
			Meteor.call('saveAs',userId, path, content);
		},

		getFromCacheOrOpen: function(userId, path,existingContent){
			var userSession = Sessions.findOne({userId: userId});
			var tabs = userSession.tabs;
			var tabToSwitch = null;
			console.log("Retrieving doc from cache or open: ", path);
			for (var i = 0; i < tabs.length; i++){
				if(tabs[i].fileName == path){
					console.log("Comparing docs ", path,tabs[i].fileName );
					tabToSwitch = i;
					break;
				}
			}
			console.log("Matched tab # ", tabToSwitch);
			if(tabToSwitch == null) {
				Meteor.call("open", userId, path, function(error, result){
					Meteor.call("createNewLocalDoc",userId, path, result);
					Meteor.call("switchTab", userId, userSession.currentTab, userSession.tabs.length, existingContent);
				});
			} else {
					//Meteor.call("createNewLocalDoc",userId, path, result);
					Meteor.call("switchTab", userId, userSession.currentTab, tabToSwitch, existingContent);
			}

		},

		open: function (userId, path){
			var fs = FileTrees.findOne({userId: userId});
			var path_array = path.trim().split('/');
			console.log("opening path");

			console.log(path_array);
			path_array.clean("");
			path_array.clean(null);
			path_array.clean(undefined);
			var fid = findFileId(fs, path_array, 0);
			console.log("FID: ", fid);
			if (fid == null){
				return null;
			}
			var result = Code.findOne({id: fid});
			console.log(result);
			return result.content;
		},

		getOrOpen: function(userId, path){
			var file = EditorCache.findOne({userId: userId, fileName: path});
			if( file == null){
				return Meteor.call('open', userId, path);
			}
			return file.content;
		},

		create: function(userId, path){
			Meteor.call('saveAs', userId, path, '');
		}
});



