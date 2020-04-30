function import_security_updates(){
    var raw = document.getElementById("security_updates").value;
    var lines = raw.split('\n');
    var security_updates = [];

    for(var i=0; i<lines.length; i++){

        //skip the heading line if it exists and blank lines
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("Date,Product") == -1){
            //check for nested commas
            lines[i] = strip_nested_commas(lines[i]);
            var params = lines[i].split(",");
            security_updates.push(new patch(params[0], params[1], params[2], params[3], params[4], params[5], params[6]));
        }
    }

    return security_updates;
}

function import_known_issues(){
    var raw = document.getElementById("known_issues").value;
    var lines = raw.split('\n');
    var known_issues = [];
    console.log("lines.length: " + lines.length);
    for(var i=0; i<lines.length; i++){

        //skip the heading line if it exists and blank lines
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("Applies To") == -1){
            var first_space = get_first_space(lines[i]);
            known_issues.push(new known_issue(lines[i].substring(0, first_space).trim(), lines[i].substring(first_space).trim()));
        }
    }
    return known_issues;
}

function import_responsible_groups(){
    const file = document.getElementById("security_updates").files[0];
    const reader = new FileReader();
    try{
        reader.readAsText(file);
    }catch(e){
        console.log(e);
    }
}

class responsible_group{
    constructor(group, product){
        this.group = group;
        this.product = product;
    }
}

class patch{
    constructor(date, product, product_family, platform, article, download, details){
        this.date = date;
        this.product = product;
        this.product_family = product_family;
        this.platform = platform;
        this.article = article;
        this.download = download;
        this.details = details;
    }
}

class known_issue{
    constructor(kb, product){
        this.kb = kb;
        this.product = product;
    }
}