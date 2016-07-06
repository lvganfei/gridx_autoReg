var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/SelectColumn/';

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

casper.on('remote.alert', function(message){
	this.echo('[Remote alert message]: '+ message, 'ERROR');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('Select Column test', 9, function suite1(test){
	casper.start(cases.testPagePrefix+cases.SelectColumn, function pageLoadCheck(){
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

	//open the select Column section in the accordionPane
	casper.then(function selectColAction(){
		this.clickLabel('Select Column Actions', 'span');
		this.waitForText('Select column Name', function columnSelectionShow(){
			this.capture(screenshotFolder+'beforeTest.png');
			test.assertTextExists('Select column Name', 'The columc action buttons is ready!');
		}, function timeOut(){
			this.echo('The column buttons not display!');
		});
		
	});

	casper.then(function selectName(){
		this.clickLabel('Select column Name', 'span');
		this.then(function checkNameisSelected(){

			var selectedCol = this.evaluate(function(){
				return grid.select.column.getSelected();
			});

			test.assertEquals(selectedCol, ["Name"], '01--The Name column get selected!');

			var nameColClass = this.getElementAttribute('td[colid=Name][aria-describedby]', 'class');

			utils.dump(nameColClass);
			test.assertNotEquals(nameColClass.indexOf('gridxColumnSelected'), -1, '02--The Name column has gridxColumnSelected class!');
		
			//Verify the result of Is column Name selected?
			this.waitForAlert(function(response){
				test.assertMatch(response.data, /true/g, '03--The result of "Is column Name selected?" should be TRUE!');
    			this.echo("Alert received: " + response.data);
    			this.sendKeys('body', '\uE00C');
			});
			this.clickLabel('Is column Name selected?', 'span');	

		})
	});

	casper.then(function deselect5(){
		//click the Deselect column Name button
		this.clickLabel('Deselect column Name', 'span');
		this.then(function checkNameisDeselected(){
			var nameColClass = this.getElementAttribute('td[colid=Name][aria-describedby]', 'class');
			test.assertEquals(nameColClass.indexOf('gridxColumnSelected'), -1, '04--The Name column should NOT have gridxColumnSelected class!');
		});

		//Verify the result of Is column Name selected?
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /false/g, '05--The result of "Is column Name selected?" should be false!');
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		this.clickLabel('Is column Name selected?', 'span');		
	});

	casper.then(function is5Selected(){
			
		//click the column header of Year and click Select column Name button
		this.clickLabel('Year', 'div');
		this.refreshGrid('grid');
		this.clickLabel('Select column Name', 'span');
		this.capture(screenshotFolder+'afterSelectYearandName.png');
		
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /true/g, '06--The result of "Is column Name selected?" should be true!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Is column Name selected?" button
		this.clickLabel('Is column Name selected?', 'span');	
		

	});

	casper.then(function getSelection(){
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /Year,Name/g, '06--The result of selected columns should be Year and Name!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected rows" button
		this.clickLabel('Get selected columns', 'span');
	});

	casper.then(function clearSelection(){
		
		//click the "Clear column selections" button
		this.clickLabel('Clear column selections', 'span');

		this.waitForAlert(function(response){
			test.assertEquals(response.data, 'selected columns: ', '07--The result of "Selected columns" now should be empty!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected columns" button again
		this.clickLabel('Get selected columns', 'span');
	});
	casper.run(function(){
		test.done();
	});
});