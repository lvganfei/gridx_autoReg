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

casper.on('remote.alert', function(message){
	this.echo('[Remote alert message]: '+ message, 'ERROR');
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

casper.test.begin('Select Row test case', 9, function suite1(test){
	casper.start(cases.testPagePrefix+cases.SelectRow, function pageLoadCheck(){
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

	//open the select row section in the accordionPane
	casper.then(function selectRowAction(){
		this.clickLabel('Select Row Actions', 'span');
		this.waitForText('Select row id 5', function rowShow(){
			this.capture(screenshotFolder+'beforeTest.png');
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
			test.assertNotEquals(fifthRow.indexOf('gridxRowSelected'), -1, '02--The 5th row should has gridxRowSelected class!');

			//Verify the result of is row 5 selected
			this.waitForAlert(function(response){
				test.assertMatch(response.data, /true/g, '03--The result of "Is row 5 selected?" should be TRUE!');
    			this.echo("Alert received: " + response.data);
    			this.sendKeys('body', '\uE00C');
			});
			this.clickLabel('Is row 5 selected?', 'span');		

		})
	});

	casper.then(function deselect5(){
		this.clickLabel('Deselect row id 5', 'span');
		this.then(function check5isDeselected(){
			var fifthRow = this.getElementAttribute('div[rowid="5"]', 'class');
			test.assertEquals(fifthRow.indexOf('gridxRowSelected'), -1, '04--The 5th row should NOT have gridxRowSelected class!');
		});

		//Verify the result of is row 5 selected
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /false/g, '05--The result of "Is row 5 selected?" should be false!');
    		this.echo("Alert received: " + response.data);
    		//dismiss the alert window
    		this.sendKeys('body', '\uE00C');
		});
		this.clickLabel('Is row 5 selected?', 'span');		
	});

	casper.then(function is5Selected(){
			
		//click the id cell of 4th row and Select row id 5 button
		this.click('div.gridxRow[rowid="4"] td[colid=id]', '50%', '50%');
		this.refreshGrid('grid');
		this.clickLabel('Select row id 5', 'span');
		this.capture(screenshotFolder+'afterSelect4and5.png');
		
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /true/g, '06--The result of "Is row 5 selected?" should be true!')
    		this.echo("Alert received: " + response.data);
    		//dismiss the alert window
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Is row 5 selected?" button
		this.clickLabel('Is row 5 selected?', 'span');	
		

	});

	casper.then(function getSelection(){
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /4,5/g, '07--The result of selected rows should be 4 and 5!')
    		this.echo("Alert received: " + response.data);
    		//dismiss the alert window
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected rows" button
		this.clickLabel('Get selected rows', 'span');
	});

	casper.then(function clearSelection(){
		
		//click the "Clear row selections" button
		this.clickLabel('Clear row selections', 'span');

		this.waitForAlert(function(response){
			test.assertEquals(response.data, 'selected rows: ', '08--The result of "Selected rows" now should be empty!')
    		this.echo("Alert received: " + response.data);
    		//dismiss the alert window
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected rows" button again
		this.clickLabel('Get selected rows', 'span');
	});
	casper.run(function(){
		test.done();
	});
});