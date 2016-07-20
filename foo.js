
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);
var utils = require('utils');
var x = require('casper').selectXPath;
//var mouse = require('mouse').create(casper);

casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('div.gridxRowHeaderRow[rowid="0"] td');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);	

};

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});

casper.start('http://idx.ibm.com/dojo_1.10.4/gridx/tests/test_grid_extendedSelect.html', function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    	//this.capture('foo.png');
   
    }, function timeOut(){
    	this.echo('timeout');
    }, 10000);
    
});

casper.then(function testXPath(){
	
	this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
	this.capture('foo.png');
});

casper.then(function deselectAll(){
	this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
	this.capture('deselectAll.png');
});

casper.then(function reload(){
	//this.reload(function(){this.gridLoadCheck()});
	this.click('div.gridxRowHeaderRow[rowid="0"] td');
	this.then(function(){
		this.page.sendEvent('click',)
	})
});

casper.then(function sendEvent(){

	this.evaluate(function shiftClick(selector){
		var shiftClick = new MouseEvent('click', {
			shiftKey: true,
			bubbles: true
		});
		var ele = document.querySelector(selector);
		ele.dispatchEvent(shiftClick);
	}, 'div.gridxRowHeaderRow[rowid="3"] td');

	this.capture('afterClick.png');
});


	
   
  
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();