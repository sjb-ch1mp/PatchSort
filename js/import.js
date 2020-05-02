let security_updates_file = null;
let master_file = null;

function load_file(input, file_type){
    try{
        let loaded_file = input.files[0];

        //check if the user cancelled the file selection
        if(loaded_file == undefined){
            return;
        }

        //check name of master.csv
        if(file_type == "master" && loaded_file.name != "master.csv") {
            throw new Error("Incorrect file. Please load 'master.csv'.");
        }else if(file_type == "update" && loaded_file.name != "Security Updates.csv"){
            throw new Error("Incorrect file. Please load 'Security Updates.csv'.");
        }

        //read file if it is the correct file type
        if(loaded_file.type != "application/vnd.ms-excel" & loaded_file.type != "text/csv") {
            throw new Error("File type not supported!");
        }else{
            let reader = new FileReader();
            reader.readAsText(loaded_file);
            reader.onprogress = function(){
                if(file_type == "master"){
                    document.getElementById("master_file_status").innerText = "Loading file...";
                }else{
                    document.getElementById("update_file_status").innerText = "Loading file...";
                }
            };
            reader.onload = function(){
                if(file_type == "master"){
                    master_file = reader.result;
                    document.getElementById("master_file_status").innerText = "Master file ready!";
                }else{
                    security_updates_file = reader.result;
                    document.getElementById("update_file_status").innerText = "Security Updates file ready!";
                }
            };
            reader.onerror = function(){
                throw new Error("Error importing file!");
            }
        }
    }catch(e){
        if(file_type == "master"){
            document.getElementById("master_file_status").innerText = e.message;
        }else{
            document.getElementById("update_file_status").innerText = e.message;
        }
    }
}

function import_security_updates(){
    if(security_updates_file == null){
        //the user has forgotten to upload the security updates file
        return null;
    }
    let lines = security_updates_file.split('\n');
    let security_updates = [];

    for(let i=0; i<lines.length; i++){
        //skip the heading line if it exists and blank lines
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("Date,Product") == -1){
            //check for nested commas
            lines[i] = strip_nested_commas(lines[i]);
            let params = lines[i].split(",");
            security_updates.push(new patch(params[0], params[1], params[2], params[3], params[4], params[5], params[6]));
        }
    }
    return security_updates;
}

function import_known_issues(){
    let raw = document.getElementById("known_issues").value;
    let lines = raw.split('\n');
    let known_issues = [];

    for(let i=0; i<lines.length; i++){

        //skip the heading line if it exists and blank lines
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("Applies To") == -1){
            let first_space = get_first_space(lines[i]);
            known_issues.push(new known_issue(lines[i].substring(0, first_space).trim(), lines[i].substring(first_space).trim()));
        }
    }
    return known_issues;
}

function import_responsible_groups(){
    if(master_file == null){
        //the user has forgotten to upload the master file
        return null;
    }
    let lines = master_file.split('\n');
    let groups = [];

    for(let i=0; i<lines.length; i++){
        //skip the heading line
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("product,group") == -1){
            groups.push(new rgroup(lines[i].split(",")[0].trim(), lines[i].split(",")[1].trim()));
        }
    }
    return groups;
}

//rgroup = responsible group
class rgroup{
    constructor(product, rgroup){
        this.group = rgroup;
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