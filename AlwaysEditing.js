var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/AlwaysEditing/';



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

casper.test.begin('AlwaysEditing test case', 2, function suite1(test){
	casper.start(cases.testPagePrefix+cases.AlwaysEditing, function pageLoadCheck(){
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

	casper.then(function editTextBox(){
		//select the first row
		this.click('span[role=radio]', '50%', '50%');
		var isSelected = this.evaluate(function(){
			return grid1.select.row.getSelected();
		});
		test.assertEquals(isSelected, ['0'], '01--The first row was selected!');
		this.click('td[aria-describedby=gridx_Grid_0-Genre][colid=Genre]', '50%', '50%');
		//type into the first textbox
		this.sendKeys('input.dijitInputInner', 'LXY', {reset: true, keepFocus: true});
		this.capture(screenshotFolder+'afterType.png');
		//Move focus out of first textbox
		this.click('td[role=columnheader]');
		//the input value should equals the value
		var newText = this.evaluate(function getTextbox(){
			return grid1.store.data[0]['Genre'];
		});
		test.assertEquals(newText, 'LXY', '02--The new value of the first textbox should equal the input value!');
	})

	casper.run(function(){
		test.done();
	});
});