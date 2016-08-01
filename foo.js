
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

casper.on('keypress', function(e){
	this.echo('pressed element is: '+e);
});

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, gridLoadCheck);
    
casper.then(function setup(){
	this.evaluate(function addEventListener(){
		document.body.addEventListener('keydown', function(e){
			console.log('the char code of event is: '+e.keyIdentifier);
			console.log('target is: '+e.target);
		});
	});
});

casper.then(function testXPath(){
	
	this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
	this.capture('selectAll.png');
});

casper.then(function deselectAll(){
	this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
	this.capture('deselectAll.png');
});



casper.then(function shiftClick(){

	this.sendKeys('#rowStart', '20', {reset:true});
	this.sendKeys('div.gridxRowHeaderRow[rowid="2"] td', ' ', {keepFocus:true});

	this.capture('aaaa.png');
});


	
   
  
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();