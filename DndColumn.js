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
			this.exit();
		}, 10000);

	});


	casper.then(function DndColumn(){
		var selectionStartX = this.getElementBounds('#grid-id').left, selectionStartY = this.getElementBounds('#grid-id').top;
	
		this.mouseEvent('mouseover', '#grid-id', '100%', '50%');
		
		//Swept select from id to Order column
		//this.mouse.down(selectionStartX+5, selectionStartY+10);
		this.mouse.down('#grid-id');
		
		//this.mouse.move(selectionStartX+200, selectionStartY+10);
		this.mouse.move('#grid-order');

		//this.mouse.up(selectionStartX+200, selectionStartY+10);
		this.mouse.up('#grid-order');
		this.capture(screenshotFolder+'SelectFinish.png');
		var selectedCol = this.evaluate(function getSelected(){
			return grid.select.column.getSelected();
		});
		test.assertEquals(selectedCol, ["id", "order"], '01--The selected column should be id and order!');
		//Dnd 300px to right
		var dndStartX = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').left, dndStartY = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').top;
		this.mouseEvent('mouseover', 'td.gridxColumnSelected[role=gridcell]', '50%', '50%');
		this.mouse.down('td.gridxColumnSelected[role=gridcell]');
		this.capture(screenshotFolder+'dndDown.png');
		this.mouse.move(dndStartX+700, dndStartY+10);
		this.capture(screenshotFolder+'dndMove.png');
		this.mouse.up(dndStartX+700, dndStartY+10);
		this.capture(screenshotFolder+'last.png');

		var colDropX = this.getElementBounds('#grid-id').left;
		this.echo(selectionStartX+' and '+colDropX);
		test.assertNotEquals(selectionStartX, colDropX, '02--The position of dragged column after dnd is changed!');
	});

	casper.run(function(){
		test.done();
	});
});


//test dnd column to non-grid target
casper.test.begin('dnd column to non-grid target', 1, function suite2(test){
	casper.start(cases.testPagePrefix+'test_grid_dndcolumn_nongrid_target.html', function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.evaluate(function addlistener(){
				document.body.addEventListener('click', function(e){
					console.log(e.clientX+'&'+e.clientY);
				})
			})
			//this.capture(screenshotFolder+'/originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture(screenshotFolder+'fail.png');
			this.exit();
		}, 10000);

	});

	casper.then(function dndToNonGrid(){
		this.click('#songForm');
		this.echo('suite 2 started!', 'INFO');
		//select Genre column
		this.then(function select(){
			
			this.click('#grid-Genre');

		});

		//dnd Genre column
		this.then(function dndColumn(){
			
			this.mouse.down('div.gridxRow[rowid="1"] td[colid="Genre"]');
			this.mouse.move(335, 365);
			this.mouse.up(335,365);
		});

		this.then(function checkResult(){
			var selectedCol = this.evaluate(function getSelected(){
				return grid.select.column.getSelected();
			});

			test.assertEquals(selectedCol, ["Genre"], '03--The selected column should be Genre!');
			this.capture(screenshotFolder+'afterDndToNonGrid.png');
			test.comment('Dnd doesnt work, a casper or grid bug to be fixed!');
		});
		
	});

	casper.run(function(){
		test.done();
	});

});