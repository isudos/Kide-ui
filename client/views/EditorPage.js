Template.EditorPage.rendered = function() {
    var editor = CodeMirror.fromTextArea(this.find("#EditorPageArea"), {
        lineNumbers: true,
        theme: "cm-s-night",
        mode: "python",
        extraKeys: {
            "Ctrl-Q": function(cm) {
                console.log("q pressed");
                var myWindow = $("#knowledgePanel");
                console.log(myWindow);

                myWindow.data("kendoWindow").center().open();
                //var text = cm.getSelection().replace(/^\s+|\s+$/g, '');
                //console.log(text);
                //console.log(Snipets.findOne({question: text}));
                //text = Snipets.findOne({question: text}).snippetText;
                //cm.replaceSelection(text)
                //function called for full screen mode 
            }
        } // set any of supported language modes here
    });     

    var reload =  function () {
        $('#EditorPageArea').data('CodeMirrorInstance', editor);
        console.log("Editor Page: Editor", editor);
        var session = Sessions.findOne({userId: Meteor.userId()});
        console.log("Session : ", session);
        var tabOrder = session.currentTab;
        console.log("Current tab # : ", tabOrder);
        var cacheFileId = session.tabs[tabOrder].cacheId;
        var currentFileRecord = EditorCache.findOne({userId: Meteor.userId(), _id:cacheFileId});
        var currentContent = currentFileRecord.content;
        var currentFile = currentFileRecord.fileName;                        
        console.log("Editor Page: reloading with current", currentFile);
        editor.setValue(currentContent);   

        //knowledge panel
        var myWindow = $("#knowledgePanel");
                console.log(myWindow);
                myWindow.kendoWindow({
                        width: "600px",
                        title: "This may help..",
                        visible: false,
                        actions: [
                            "Pin",
                            "Minimize",
                            "Maximize",
                            "Close"
                        ]
                        
                    }).data("kendoWindow");

    };

    this.autorun(function () {
        if (Meteor.user() && Session.get("inited") == "done"){
            console.log("Editor Page: refreshing editor");
            Meteor.subscribe("EditorCache", Meteor.userId());
            Meteor.subscribe("Sessions", Meteor.userId());
            reload();
        }

    });

 

    //console.log("Editor: reloading");
    //reload();

};