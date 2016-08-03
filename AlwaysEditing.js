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

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('AlwaysEditing test case', 5, function suite1(test){
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
		
	});

	casper.then(function textFocus(){
		//retain focus test
		this.reload(function reload(){
			this.waitForSelector('td.gridxCell ', function(){
				this.echo('page reload!');
			});
		});

		this.then(function reFocusText(){
			this.click('input.dijitInputInner');
			//sendKeys() cant retain focus, may be a bug
			//this.sendKeys('input.dijitInputInner', 'hi', {reset:true, keepFocus: true});
			this.capture(screenshotFolder+'afterReFocus.png');
		});
		
		this.then(function wait3s(){
			this.wait(3000);
		});

		this.then(function checkFocus(){
			
			var activeEleId = this.evaluate(function getActive(){
				return document.activeElement.id;
			});
			//utils.dump(activeEleId);

			var firstTextboxId = this.getElementAttribute('input.dijitInputInner', 'id');
			
			//utils.dump(firstTextboxId);
			//the active element should be the first textbox
			test.assertEquals(activeEleId, firstTextboxId, '03-The focus should retain in the first input box!');

		});
		
		
	});

	casper.then(function editComboBox(){
		var oriComboVal = this.evaluate(function getOriComboVal(){
			return grid1.store.data[0].Album;
		});
		//utils.dump(oriComboVal);
		this.capture('origin.png');
		this.click('input.dijitArrowButtonInner', '50%', '50%');
		this.then(function changeComboVal(){
			this.waitUntilVisible('div.dijitPopup', function selectItem(){
				this.capture('clickArrow.png');
				// click the "Down the Road" menu item to select it
				this.clickLabel('Down the Road', 'div');
				this.capture('afterSelect.png');
				
			});
		});

		this.then(function wait3s(){
			this.wait(3000);
		});
 		
		this.then(function getActiveE(){

			this.capture('afterSelect3s.png');

			var activeEle = this.evaluate(function getActive(){
				return document.activeElement.id;
			});
			
			utils.dump(activeEle);

			var firstComboId = this.getElementAttribute('input.dijitInputInner[role=textbox]', 'id');
			
			utils.dump(firstComboId);

			//here check the active element is combo, focus is in combo
			//here is a bug, the focus can't retain in the combo
			test.assertEquals(activeEle, firstComboId, '04--the focus should retain in the first combo!');

		});

		this.then(function checkVal(){
			//Move focus out
			this.clickLabel('ID', 'div');

			var newComboVal = this.evaluate(function getNewComboVal(){
				return grid1.store.data[0].Album;
			});
			
			//here check the new Combo value
			//utils.dump(newComboVal);
			test.assertEquals(newComboVal, 'Down the Road', '05--The new value of first Combo should be the value set in former step!');
		});

	});

	casper.run(function(){
		test.done();
	});
});