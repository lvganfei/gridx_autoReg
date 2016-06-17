
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
casper.start('http://idx.ibm.com/dojo_1.10.4/gridx/tests/test_grid.html', function() {
    this.waitForSelector('td[role=gridcell]', function loadfinished(){
    	this.echo(this.getTitle());
    });
    
});

casper.then(function() {
	this.echo('IS the delete button exists? '+this.exists('#dijit_form_Button_4'));
	/*this.clickLabel('Delete the first row', 'span');
	this.click('#dijit_form_Button_4');*/
	this.evaluate(function(){
			document.querySelector('#dijit_form_Button_4').click();
			var el = document.querySelector('#dijit_form_Button_4');
			var ev = document.createEvent("MouseEvent");
    		ev.initMouseEvent(
        		"click",
       			 true /* bubble */, true /* cancelable */,
        		window, null,
        		0, 0, 0, 0, /* coordinates */
        		false, false, false, false, /* modifier keys */
        		0 /*left*/, null
    			);
    		el.dispatchEvent(ev);
			

		});
	//this.sendKeys('#dijit_form_Button_4', casper.page.event.key.Enter,{keepFocus: true});
	this.capture('foo.png');
   
    this.echo(cases.SimplestGrid);
   
});

casper.run();