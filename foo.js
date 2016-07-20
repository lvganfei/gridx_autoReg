
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

var gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('div.gridxRowHeaderRow[rowid="0"] td');
		}, function then(){
			this.echo('page loaded!');
			this.capture('originGrid.png');
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

casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, gridLoadCheck);
    


casper.then(function testXPath(){
	
	this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
	this.capture('foo.png');
});

casper.then(function deselectAll(){
	this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
	this.capture('deselectAll.png');
});

casper.then(function clickFirstRow(){
	//this.reload(function(){this.gridLoadCheck()});
	this.click('div.gridxRowHeaderRow[rowid="0"] td');
	/*this.then(function(){
		this.page.sendEvent('click',)
	})*/
});

casper.then(function shiftClick(){

	this.evaluate(function shiftClick(selector){
		var ele = document.querySelector(selector);
		//create event via event constructor
		var mouseDownEvt = new MouseEvent("mousedown",{
			bubbles:true,
			cancelable:true,
			view:window,
			shiftKey: true
		});

		// create event in old way
		var mouseDownEvt = document.createEvent('MouseEvents');
		mouseDownEvt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, true, false, 0, null);
		ele.dispatchEvent(mouseDownEvt);

		//dispatch a shift + mousedown event
		ele.dispatchEvent(mouseDownEvt);

		var mouseUpEvt = new MouseEvent("mouseup", {
			bubbles:true,
			cancelable:true,
			view:window	
		});
		//dispatch a mouseup event
		ele.dispatchEvent(mouseUpEvt);

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