Template.KnowledgePanel.rendered = function() {

	var myWindow = this.find("#knowledgePanel");
	myWindow.kendoWindow({
                        width: "600px",
                        title: "About Alvar Aalto",
                        visible: false,
                        actions: [
                            "Pin",
                            "Minimize",
                            "Maximize",
                            "Close"
                        ],
                        close: onClose
                    }).data("kendoWindow").center().open();

};