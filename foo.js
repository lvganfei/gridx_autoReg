
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);
var utils = require('utils');
var mouse = require('mouse').create(casper);

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
casper.start('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid_dnd_rearrange.html', function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    	//this.capture('foo.png');
   
    });
    
});

casper.then(function() {
	utils.dump(this.getElementBounds('#grid-Artist').left+' and '+this.getElementBounds('#grid-Artist').top);
	//this.click('#grid-Artist');
	this.capture('dndbefore.png');
	//this.mouseEvent('mouseover', '#grid-Artist', '100%', '50%');
	//this.capture('dndOver.png');
	this.mouse.down(this.getElementBounds('#grid-Artist').left, this.getElementBounds('#grid-Artist').top+10);
	this.capture('dndDown.png');
	this.mouse.move(this.getElementBounds('#grid-Artist').left+100, this.getElementBounds('#grid-Artist').top+10);
	//this.capture('dndMove.png');
	this.mouse.up(this.getElementBounds('#grid-Artist').left+100, this.getElementBounds('#grid-Artist').top+10);
	this.capture('DndUp.png');
	//this.mouseEvent('mouseover', 'td.gridxColumnSelected[role=gridcell]', '50%', '50%');
	this.mouse.down('td.gridxColumnSelected[role=gridcell]');
	this.mouse.move(this.getElementBounds('#grid-Artist').left+400, this.getElementBounds('#grid-Artist').top+80);
	this.capture('dndMove.png');
	this.mouse.up(this.getElementBounds('#grid-Artist').left, this.getElementBounds('#grid-Artist').top+40);
	this.capture('last.png');
	//utils.dump(this.getElementInfo('#grid-Artist'));
   
   
});
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();