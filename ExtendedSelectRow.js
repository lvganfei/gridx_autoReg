var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/ExtendedSelectRow/';

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

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('ExtendedSelect Row test case', 3, function suite1(test){
	casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);

	});

	//test case start here
	//Select by buttons
	casper.then(function selectBtn(){

		this.clickLabel('Select', 'button');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		var selectedId = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');

		this.echo(rowStatus);
		utils.dump(selectedId);
		this.echo(typeof selectedId);
		
		//check if the style of selected row 0-5 is changed to gridxRowSelected.
		test.assertEquals(selectedId, ['0','1','2','3','4','5'], '01--The selected ID should be 0-5!');

		//the value of rowStatus textarea is 0-5
		test.assertEquals(rowStatus, '0\n1\n2\n3\n4\n5', '02--Select row is right!');

		//the total number of selected row is 6
		test.assertElementCount('div.gridxRow.gridxRowSelected', 6, '03--The selected rows count is 6!');
	
	});

	//deselect 0-5 rows by clicking the deselect button
	casper.then(function deselectBtn(){
		this.clickLabel('Deselect', 'button');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		var selectedId = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');

		//the value of rowStatus textarea is now empty
		test.assertEquals(rowStatus, '', '04--Now the value of selected row status is empty!');

		//the row has gridxRowSelected class doesnt exist now
		test.assertDoesntExist('div.gridxRowSelected', '05--Now the row has gridxRowSelected class NOT exist!');

	});

	//defect#13249
	//Hold down SHIFT throughout step below
	//1.click on row id=5(jazz, Andy Narell)
	//2.click on row id=0(Easy Listening), this shows row id 0-5 highlight, and row id 0-5 selected under selection status as expected
	//3.click on row id=11(World, Andy Statmen), this shows row id 5-11 highlight, but rows0-11 as selected under selection status
	//for cell selection part:
	//1.Click on cell 2,Genre(Jazz)
	//2.Hold down SHIFT and click on cell 3, Artist(Emerson), now the selected id are ok: [2, Genre],[3,Genre],[2,Artist],[3,Artist]
	//3. click on cell 1,Genre(Classic Rock), now the selection is highlighted but selected ids are: [1,Genre],[2,Genre],[3,Genre], not [1,Genre],[2,Genre]
	//defect#12789 for dnd_rearrange.html, triggerOnCell is true
	//Use the mouse click to select a row
	//Use the up/down arrow to move the cell focus up/down few rows
	//use the space key tring to select te row where the cell focus is in. This row not get selected sometime


	casper.run(function(){
		test.done();
	});
});