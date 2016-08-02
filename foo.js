
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
			console.log('the key of event is: '+e.keyIdentifier+' keyCode is: '+e.keyCode);
			console.log('target is: '+e.target.tagName+'.('+e.target.className+')');
			console.log('active element is: '+document.activeElement.tagName+'.('+document.activeElement.className+')');
		});
		grid.onRowHeaderCellKeyDown= function(e){console.log(e.key||e.charCode); console.log('now in grid rowheader: '+document.activeElement.tagName+'.('+document.activeElement.className+')')}
	});
});


casper.then(function tabKey(){

/*	var focusedEle; 
	
	
	do{

			this.page.sendEvent('keypress', this.page.event.key.Tab);
			
			focusedEle = this.evaluate(function getfocused(){
				return document.activeElement.className;

			});
			this.echo(focusedEle,'ERROR');
		
	}while (focusedEle.indexOf('gridxRowHeaderCell') == -1);*/

	//press TAB 3 times
	for(var i=0;i<3;i++){
		this.page.sendEvent('keypress', this.page.event.key.Tab);
	}
	


	
});

casper.then(function spaceKey(){

	//this.refreshGrid('grid');
	//workaround for the bug not retain focus in rowheader from previous step
	this.page.sendEvent('keypress', this.page.event.key.Tab);
	
	this.page.sendEvent('keypress', this.page.event.key.Arrowdown);

	var focusedEle = this.evaluate(function getfocused(){
				return document.activeElement.className;

	});

	var firstRow = this.evaluate(function(){
		return document.querySelector('.gridxRowHeaderRow[rowid="0"] td').className;
	});

	this.echo('Now in new step: '+focusedEle,'ERROR');
	this.echo('class of first row header: '+firstRow, 'ERROR');
	this.page.sendEvent('keypress', this.page.event.key.Down);
	this.page.sendEvent('keypress', this.page.event.key.Space);
	this.then(function(){
		this.capture('aaaa.png');
	})
});

casper.then(function(){
	this.bypass(2);
});

casper.then(function testXPath(){
	
	this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
	this.capture('selectAll.png');
});

casper.then(function deselectAll(){
	this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
	this.capture('deselectAll.png');
});


	
   
  
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();