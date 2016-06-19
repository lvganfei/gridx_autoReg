
var cases = require('./common').cases;
var config = require('./common').config;
var casper = require('casper').create(config);

/*casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('Resource error code: '+ error.errorCode+" error string is: "+error.errorString+" error url is: "+error.url+' id: '+error.id,'ERROR');
});
*/
casper.start('http://localhost/workspace/dojo1.10.4/gridx/tests/'+cases.SimplestGrid, function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    	this.capture('foo.png');
   
    });
    
});

casper.then(function() {
	this.echo('IS the delete button exists? '+this.exists('#dijit_form_Button_4'));
	this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');
	var lenthA = this.evaluate(function(){
			/*grid.store.remove(grid.row(0).id);
			
			document.querySelector('#dijit_form_Button_4').click();
			document.querySelector('#dijit_form_Button_4').click();
			document.querySelector('#dijit_form_Button_4').click();*/
			return grid.store.data.length;
	});
	//this.sendKeys('#dijit_form_Button_4', casper.page.event.key.Enter,{keepFocus: true});
	this.wait(3000);
	this.then(function(){
		this.echo(lenthA);
		this.capture('foo1.png');
	});
   
   
});

casper.run();