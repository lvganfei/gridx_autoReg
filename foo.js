
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);
var utils = require('utils');
//var mouse = require('mouse').create(casper);

casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};
/*casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});
*/
casper.start('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid_alwaysEditing.html', function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    	//this.capture('foo.png');
   
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
				this.wait(3000);
			});
		});


 		
		this.then(function getActiveE(){

			this.capture('afterSelect3s.png');
			var activeEle = this.evaluate(function getActive(){
				return document.activeElement.className;
			});
			utils.dump(activeEle);
			//here check the active element is combo, focus is in combo
		});

		this.then(function checkVal(){
			this.clickLabel('ID', 'div');
			var newVComboVal = this.evaluate(function getNewComboVal(){
				return grid1.store.data[0].Album;
			});
			//here check the new Combo value
			utils.dump(newVComboVal);
		});
	
});


	
   
  
/*
casper.thenOpen('http://localhost/workspace/dojo1.10.4/gridx/tests/test_grid.html', function refresh(){
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	this.refreshGrid('grid');
	this.capture('foo1.png');
});*/

casper.run();