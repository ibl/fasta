//FASTA.require(['jmat','usm','jQuery']);

// CpG frequency
// Cysteine 	C	TGT, TGC                 TG[TC]
// Glycine  	G   GGT, GGC, GGA, GGG       GG[TCAG]

FASTAmodule=function(div){
    console.log(div);
    this.div = div;
    var dt = div.dt;
    var n = 0; // hits
    var nn = 0; // sequences hit
    var nnn = 0; // total sequence length
    var pat = new RegExp($('#seqSearch',div)[0].value,'gi');
    dt.body.map(function(x){
        nnn +=x.length;
        var m = x.match(pat);
        if(!!m){
            n+=m.length;
            nn++;
        }  
    })
    $('#divHeadBody',div)[0].innerHTML='<span style="color:blue">CpG count (/'+$('#seqSearch',div)[0].value+'/gi): '+n+' hits in '+nn+' sequences, accounting for '+n*600/nnn+'% of the sequences length.</span>';
}




