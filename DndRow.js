var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/DndRow/';

//edit the capser object properties in test instance
casper.options.verbose = config.verbose;
casper.options.logLevel = config.logLevel;
casper.options.viewportSize = config.viewportSize;

//error event handlers
casper.on("page.error", function(msg, trace) {
    this.echo("[Page Error]: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('[Resource error code]: '+ error.errorCode+" [error string]: "+error.errorString+" [error url]: "+error.url+' [id]: '+error.id,'ERROR');
});

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('dnd row test case', 3, function suite1(test){
	casper.start(cases.testPagePrefix+cases.DndRow, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);

	});

	//defect#12789 for dnd_rearrange.html, triggerOnCell is true
	casper.then(function clickOneRow(){
		//Use the mouse click to select row#2
		this.click('div.gridxRow[rowid="2"] td[colid="Genre"]');

		this.then(function checkResult(){
			var rowClass = this.getElementAttribute('div.gridxRowHeaderRow[rowid="2"]', 'class');
			var selected = this.evaluate(function(){
				return grid.select.row.getSelected();
			});

			test.assertEquals(selected, ["2"], '01--The selected row is row#2!');
			test.assertMatch(rowClass, /gridxRowSelected/g, '02--The row class should has selected rule!');
		})
	});

	
	//Use the up/down arrow twice to move the cell focus up/down 2 rows
	casper.then(function arrowKey(){

		this.page.sendEvent('keypress', this.page.event.key.Down);
		this.page.sendEvent('keypress', this.page.event.key.Down);

	});

	//use the space key tring to select te row where the cell focus is in. This row not get selected sometime
	casper.then(function spaceKey(){

		this.page.sendEvent('keypress', this.page.event.key.Space);

		this.then(function checkResult(){
			var rowClass = this.getElementAttribute('div.gridxRowHeaderRow[rowid="2"]', 'class');
			var selected = this.evaluate(function(){
				return grid.select.row.getSelected();
			});

			test.assertEquals(selected, ["4"], '03--Now the selected row is row#2!');
		})
	})

	casper.run(function(){
		test.done();
	});
});