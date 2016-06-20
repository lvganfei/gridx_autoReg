
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);
var utils = require('utils');

casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};
/*casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});
*/
casper.start('http://idx.ibm.com/dojo_1.10.4/gridx/tests/'+cases.ColumnResizer, function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    	this.capture('foo.png');
   
    });
    
});

casper.then(function() {
	utils.dump(this.getElementBounds('#grid-Artist'));
	utils.dump(this.getElementInfo('#grid-Artist'));
   
   
});

casper.thenOpen('http://idx.ibm.com/dojo_1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});
casper.run();