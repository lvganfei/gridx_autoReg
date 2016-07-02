var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/SelectRow/';

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

casper.test.begin('Select Row', 6, function suite1(test){
	casper.start(cases.testPagePrefix+cases.SelectRow, function pageLoadCheck(){
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

	//open the select row section in the accordionPane
	casper.then(function selectRowAction(){
		this.clickLabel('Select Row Actions', 'span');
		this.waitForText('Select row id 5', function rowShow(){
			this.capture(screenshotFolder+'origin.png');
			test.assertEquals(this.visible('#dijit_form_Button_0'), true, 'The row buttons should display!');
		}, function timeOut(){
			this.echo('The row buttons not display!');
		});
		
	});

	casper.then(function select5(){
		this.clickLabel('Select row id 5', 'span');
		this.then(function check5isSelected(){

			var selectedRow = this.evaluate(function(){
				return grid.select.row.getSelected();
			});

			test.assertEquals(selectedRow, ["5"], '01--The 5th row get selected!');

			var fifthRow = this.getElementAttribute('div[rowid="5"]', 'class');

			utils.dump(fifthRow);
			test.assertNotEquals(fifthRow.indexOf('gridxRowSelected'), -1, '02--The 5th row has gridxRowSelected class!');

		})
	});

	casper.then(function deselect5(){
		this.clickLabel('Deselect row id 5', 'span');
		this.then(function check5isDeselected(){
			var fifthRow = this.getElementAttribute('div[rowid="5"]', 'class');
			test.assertEquals(fifthRow.indexOf('gridxRowSelected'), -1, '03--The 5th row should NOT have gridxRowSelected class!');
		});
	});

	casper.then(function is5Selected(){

	});

	casper.then(function clearSelection(){

	});

	casper.then(function getSelection(){

	});
	casper.run(function(){
		test.done();
	});
});