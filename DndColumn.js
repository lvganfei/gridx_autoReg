var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/DndColumn/';

casper.options.verbose = true;
casper.options.logLevel = 'debug';
casper.options.viewportSize = {width:1280, height:800};

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

casper.test.begin('Dnd', 2, function suite1(test){
	casper.start(cases.testPagePrefix+cases.DndColumn, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			//this.capture(screenshotFolder+'/originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);

	});


	casper.then(function DndColumn(){
		var selectionStartX = this.getElementBounds('#grid-Genre').left, selectionStartY = this.getElementBounds('#grid-Genre').top;
		this.capture(screenshotFolder+'before.png');
		this.mouseEvent('mouseover', '#grid-Genre', '100%', '50%');
		this.capture(screenshotFolder+'selectOver.png');
		//Swept select from Genre column
		this.mouse.down(selectionStartX+5, selectionStartY+10);
		this.capture(screenshotFolder+'selectDown.png');
		this.mouse.move(selectionStartX+200, selectionStartY+10);
		this.capture(screenshotFolder+'selectMove.png');
		this.mouse.up(selectionStartX+200, selectionStartY+10);
		this.capture(screenshotFolder+'SelectFinish.png');
		var selectedCol = this.evaluate(function getSelected(){
			return grid.select.column.getSelected();
		});
		test.assertEquals(selectedCol, ["Genre", "Artist"], '01--The selected column should be Genre and Artist!');
		//Dnd 300px to right
		var dndStartX = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').left, dndStartY = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').top;
		this.mouseEvent('mouseover', 'td.gridxColumnSelected[role=gridcell]', '50%', '50%');
		this.mouse.down('td.gridxColumnSelected[role=gridcell]');
		this.capture(screenshotFolder+'dndDown.png');
		this.mouse.move(dndStartX+300, dndStartY+10);
		this.capture(screenshotFolder+'dndMove.png');
		this.mouse.up(dndStartX+300, dndStartY+10);
		this.capture(screenshotFolder+'last.png');

		var colDropX = this.getElementBounds('#grid-Genre').left;
		this.echo(selectionStartX+' and '+colDropX);
		test.assertNotEquals(selectionStartX, colDropX, '02--The position after dnd is changed!');
	});
	casper.run(function(){
		test.done();
	});
});