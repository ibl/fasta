console.log('fasta.js loaded');


FASTA=function(txt,id,i){ // this is the class, for regular FASTA functions like parsing come later

/////// methods of a FASTA instance ////////////

this.buildUI=function(id){
	if(!id){id=this.id}
	var div=document.getElementById(id);
	if(div==null){ // if this is a new element
		div=document.createElement('div');
		div.id=id;
		FASTA.div.appendChild(div);
	}
	var dt = this.data; // that's where the fun is :-)
	var n = dt.head.length;
	div.innerHTML='<hr><span style="color:navy" id="fileID"> ID: '+id+' ('+n+' sequences)</span><br>';
	this.div=div; // register the div to the instance it is the UI of
	this.div.dt=dt;
	this.div.i=this.i; // the ith FASTA
	// show head and body
	var divHead = document.createElement('div');divHead.id="divHead";
	div.appendChild(divHead);
	var divHeadHead = document.createElement('div');divHeadHead.id="divHeadHead";
	divHead.appendChild(divHeadHead);
	divHeadHead.style.fontSize='x-small';
	var divHeadBody = document.createElement('div');divHeadBody.id="divHeadBody";
	divHeadBody.style.fontSize='x-small';
	divHead.appendChild(divHeadBody);
	
	divHeadHead.innerHTML='Search: <input id="seqSearch"> <input name="searchFasta" type="radio" value="head"> head <input name="searchFasta" type="radio" value="seq" checked=true> sequence <button id="searchClear">Clear</button>';
	var sc = jQuery('#searchClear',this.div)[0];
	sc.div = this.div;
	sc.onclick=function(){
		var divHeadBody = jQuery('#divHeadBody',this.div)[0];
		divHeadBody.innerHTML="...";
	}
	var IPs = jQuery('input',divHeadHead);
	IPs[0].onkeyup = function(evt){
		if(evt.keyCode==13){ // search fasta entries
			var div = this.parentElement.parentElement.parentElement;
			var IPs=jQuery('input',this.parentElement);
			var dt = div.dt;
			if(IPs[1].checked){ // search head
				var vals=dt.head;
			} else {
				var vals=dt.body;
			}
			var rg = new RegExp(this.value);
			var n = vals.length;
			var divHeadBody = jQuery('#divHeadBody',div)[0];
			divHeadBody.textContent='';
			var tbl = document.createElement('table');
			divHeadBody.appendChild(tbl);
			var flds = Object.getOwnPropertyNames(dt);
			var m = flds.length;
			var tbd = document.createElement('tbody');
			tbl.appendChild(tbd);
			tbl.style.fontSize='x-small';
			var tr,tdi0,tds=[];
			for(var i=0 ; i<n ; i++){
				if(!!vals[i].match(rg)){
					tr = document.createElement('tr');
					tdi0 = document.createElement('td');tbd.appendChild(tr);
					tdi0.textContent=i;
					tr.appendChild(tdi0);
					for (var j=0 ; j<m ; j++ ){
						tds[j] = document.createElement('td');
						tds[j].textContent=dt[flds[j]][i];
						tr.appendChild(tds[j]);
						
					}
					tbd.appendChild(tr);
					
				}
				
			}
			
			
			
		}
	}
	divHeadBody.innerHTML='...'
	
	/*
	var heads = Object.getOwnPropertyNames(dt.head).sort();
	for(var i=0;i<heads.length;i++){
		var a = document.createElement('a');
		a.textContent=" "+heads[i];
		a.style.fontSize="x-small";
		//a.style.color="red";
		a.i=i;
		a.dt=dt.head[heads[i]];
		divHeadHead.appendChild(a);
		a.onclick=function(){
			//lala = this;
			divHeadBody.textContent=JSON.stringify(this.dt,undefined,1);
			//lala = divHeadBody;
		}
	}
	*/	
	var divBody = document.createElement('div');divBody.id="divBody";
	div.appendChild(divBody);
	
	var divBodyHead = document.createElement('div');divBodyHead.id="divBodyHead";
	divBody.appendChild(divBodyHead);
	var sel = document.createElement('select');divBodyHead.appendChild(sel);
	sel.style.fontSize='x-small';
	for(var i=0;i<FASTA.modules.length;i++){
		var opti = document.createElement('option');
		opti.value=i;
		opti.textContent=FASTA.modules[i].name;
		sel.appendChild(opti);
	}
	sel.style.verticalAlign="top";
	var lst = document.createElement('select');divBodyHead.appendChild(lst);
	lst.style.fontSize='x-small';
	var lsti = document.createElement('option');lst.appendChild(lsti);lsti.textContent='Workflow Log:';
	lst.size=2;
	sel.lst = lst;
	sel.onchange=function(){
		var i = parseInt(this.value);
		var j = this.parentElement.parentElement.parentElement.i;
		if(true){ // uncomment when debugging modules
		//if(!FASTA.modules[i].fun){ // comment when debugging modules
			var s = document.createElement('script');
			s.i = i;
			s.j = j;
			s.src = FASTA.modules[i].url;
			s.onload = function(){
				FASTA.modules[this.i].fun=FASTAmodule;
				FASTA.modules[this.i].fun(FASTA.dir.fastas[this.j].div);
			}
			document.body.appendChild(s);	
		} else{
			FASTA.modules[i].fun(FASTA.dir.fastas[j].div);
		}
		// register execution
		var lsti = document.createElement('option');sel.lst.appendChild(lsti);
		lsti.textContent=FASTA.modules[i].name;
		lsti.selected=true;
	}
	// Body Body (analysis results)
	var divBodyBody = document.createElement('div');divBodyBody.id="divBodyBody";
	divBody.appendChild(divBodyBody);
	
}

if(!id){id=FASTA.uid('FASTA')};
if(!!txt){
	this.data=FASTA.parse(txt);
	this.id=id; // the file name if txt was got be a reader
	this.i=i; // index in the dir.fastas
	if(!!FASTA.div){ // check that there is a registered div for FASTA data
		this.buildUI();
	}
} else {
	this.data=undefined;
}
	 
}

//////// methods of the FASTA class //////////

FASTA.dir={fastas:[],ids:[]}; // store parsed fastas here

FASTA.uid=function(prefix){ // create unique ids
	if(!prefix){prefix='UID'}
	var uid=prefix+Math.random().toString().slice(2);
	return uid
};

FASTA.startUI=function(id){  // prepare div for a FASTA instance
	var div = document.createElement('div');
	div.id=id;
	div.innerHTML='<p style="color:blue"> ID: '+id+' (processing)</p>';
	FASTA.div.appendChild(div);
};

FASTA.buildUI=function(id){ // main UI
	
	id = id || FASTA.uid('FASTA');
	var div = document.getElementById(id)
	if(!div){
		div = document.createElement('div');div.id=id;
		document.body.appendChild(div);	
	}
	div.innerHTML='[<a href="https://github.com/ibl/fasta" target="_blank">source code</a>] Load FASTA file:';
	console.log('UI build')
	// Read local files
	var ipf = document.createElement('input'); // input file API
	ipf.type="file";
	ipf.setAttribute('multiple','multiple');
	ipf.onchange=function(evt){
		//var f=evt.target.files[0];
		var i0=FASTA.dir.ids.length; // number of fastas registered already
		for(var i=0;i<evt.target.files.length;i++){
			var reader = new FileReader();
			reader.i=i0+i;
			var fname = evt.target.files[i].name;
			FASTA.dir.ids[i0+i]=fname;
			FASTA.startUI(fname); // a div for this FASTA file
			console.log('started parsing '+fname+' ...');
			reader.onload=function(x){
				var txt=x.target.result;
				//console.log(txt);
    	    	FASTA.dir.fastas[this.i]=new FASTA(txt,FASTA.dir.ids[this.i],this.i);
				//FASTA.dir.fastas[this.i].fileName=FASTA.dir.ids[this.i];
				console.log('... done parsing '+fname);
	    	}
			
	    reader["readAsText"](evt.target.files[i]);			
		}
		
		//reader["readAsBinaryString"](f);
	}
	div.appendChild(ipf);
	// Read dropbox files
	var drpBox = document.createElement('input');
	drpBox.type="dropbox-chooser";
	drpBox.setAttribute('name','selected-file');
	drpBox.style.visibility="hidden";
	drpBox.setAttribute('data-link-type','direct');
	drpBox.setAttribute('data-multiselect',true);
	//drpBox.setAttribute('data-extensions','.FASTA');
	drpBox.addEventListener("DbxChooserSuccess",function(evt){
		var i0=FASTA.dir.ids.length; // number of fastas registered already
		for(var i=0;i<evt.files.length;i++){
			var fname=evt.files[i].name;
			var thisi=i0+i;
			FASTA.dir.ids[i0+i]=fname;
			FASTA.startUI(fname); // a div for this FASTA file
			console.log('started parsing '+fname+' ...');
			var reader = function(txt){
				//console.log(txt);
				FASTA.dir.fastas[this.success.i]=new FASTA(txt,FASTA.dir.ids[this.success.i],thisi);
				//FASTA.dir.fastas[this.success.i].fileName=FASTA.dir.ids[this.success.i];
				console.log('... done parsing '+fname);
			};
			reader.i=i0+i;
			jQuery.get(evt.files[i].link,reader)
		}
		
	})
	//drpBox.setAttribute('data-extensions','.ab1 .fsa');
	div.appendChild(drpBox);
	var sp = document.createElement('script');
	sp.type='text/javascript';
	sp.src='https://www.dropbox.com/static/api/1/dropins.js';
	sp.id='dropboxjs';
	sp.setAttribute('data-app-key','8whwijxgl8iic3j');
	//document.body.appendChild(sp);
	setTimeout(function(){document.head.appendChild(sp)},1000);
	FASTA.div=div; // registering the div element so FASTA instances can find it
	
}

FASTA.parse=function(x){
	console.log('(parsing a '+x.length+' long string)');
	//x='\n'+x;
	x=x.split(/[\n\r]\>/);
	x[0]=x[0].slice(1); // remove ">" from teh first entry
	y={head:[],body:[]};
	var n=x.length; // number of lines in the file
	if(x[n-1].length==0){n=n-1}; // remove trailing blank
	var z;
	for(var i=0;i<n;i++){
		z = x[i].split(/\n/);
		y.head[i]=z[0];
		y.body[i]=z.slice(1).join('');
		
	}
	
	return y;
};



// Modules

FASTA.modules=[

{
	name:'Modules',
	url:'Modules.js',
	fun:function(div){
		var divBB = jQuery('#divBodyBody',div)[0];
		divBB.innerHTML=""; // clear
	}
},

//{
//	name:'USM encoding',
//	url:'USMencode.js', // use something else later
//	//url:'https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/FASTA/listAll.js'
//	//fun:function(x){console.log(x)}
//},

{
	name:'CpG frequency',
	url:'CpGfreq.js',
	//url:'https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/FASTA/plotAll.js'
	//fun:function(x){console.log(x)}
},

{
	name:'Consensus',
	url:'consensus.js',
	//url:'https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/FASTA/plotAll.js'
	//fun:function(x){console.log(x)}
},


];


// Context dependent actions

if(!!window.IPE){ // check for the Integrated Pathology Ecosystem, http://ibl.github.io/IPE/
	IPE.ui.registerTab({id:'FASTA',title:'FASTAtbox',switchTab:true});
	FASTA.buildUI('FASTA');
}

// Dependencies

if(!window.d3){
	var s = document.createElement('script');
	s.src='https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.9/d3.min.js';
	document.head.appendChild(s);
	
}



/////////////////////

FASTA.uid=function(prefix){
	if(!prefix){prefix='UID'}
	var uid=prefix+Math.random().toString().slice(2);
	return uid
}

FASTA.getScript=function(url,cb,er){ // load script
	var s = document.createElement('script');
	s.src=url;
	s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	if(!this.div){ // no DOM context
		document.head.appendChild(s);
		setTimeout('document.head.removeChild(document.getElementById("'+s.id+'"));',10000); // is the waiting still needed ?
	} else {
		this.div.appendChild(s);
	}
	
	return s.id
},

FASTA.require=function(url,fun){ // satisfies dependencies with other libraries
	if (Array.isArray(url)){
		if(url.length>1){
			this.require(url[0],function(){FASTA.require(url.slice(1),fun)});
		} else {
			this.require(url[0],fun);
		}
	} else{
		if(url.match(':')==null){
			if(!FASTA.require.lib[url]){throw('no library found to populate variable '+url)}
			else{
				console.log('populating variable "'+url+'" with '+FASTA.require.lib[url]);
				url=FASTA.require.lib[url];
			}			
		}
		this.getScript(url,fun);
	}
}

FASTA.require.lib={
	//jmat:'https://jmat.googlecode.com/git/jmat.js',
	jmat:'jmat.js',
	jQuery:'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
	d3:'https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.9/d3.min.js',
	usm:'usm.js' // use something external instead
}


/// Dependencies
FASTA.require(['jmat','usm','jQuery']);

/// MISCelaneous ////
//if(!window.jQuery){FASTA.getScript('jquery-1.4.2.min.js')} // airplane debugging



