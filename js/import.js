/**
 * The import.js file contains all methods related to importing files
 * and collecting objects from the files.
 *
 * @author: sjb-ch1mp
 */

let security_updates_file = null;
let master_file = null;

/**
 * This method reads in a file loaded by the user and saves it to the global variables 'security_updates_file' or
 * 'master_file'.
 *
 * @param input: The <input> object from PatchSort.html
 * @param file_type: The type of the file (either "master" or "update").
 */
function load_file(input, file_type){
    try{

        //fetch the uploaded file
        let loaded_file = input.files[0];

        //check if the user cancelled the file selection
        if(loaded_file == undefined){
            return;
        }

        //check name of patchsort-master.csv
        if(file_type == "master" && loaded_file.name != "patchsort-master.csv") {
            throw new Error("Incorrect file. Please load 'patchsort-master.csv'.");
        }else if(file_type == "update" && loaded_file.name != "Security Updates.csv"){
            throw new Error("Incorrect file. Please load 'Security Updates.csv'.");
        }

        //read file if it is the correct file type
        if(loaded_file.type != "application/vnd.ms-excel" & loaded_file.type != "text/csv") {
            throw new Error("File type not supported!");
        }else{

            //if so, read in the file and assign it to the applicable variable.
            let reader = new FileReader();
            reader.readAsText(loaded_file);
            reader.onprogress = function(){
                if(file_type == "master"){
                    document.getElementById("master_file_status").innerText = "  ... Loading file.";
                }else{
                    document.getElementById("update_file_status").innerText = "  ... Loading file.";
                }
            };
            reader.onload = function(){
                if(file_type == "master"){
                    master_file = reader.result;
                    document.getElementById("master_file_status").innerText = "  ... Master file ready!";
                }else{
                    security_updates_file = reader.result;
                    document.getElementById("update_file_status").innerText = "  ... Security Updates file ready!";
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

/**
 * Parse the security_updates_file variable and return an array of patches.
 *
 * @returns {null|[]}: the patches from the 'Security Updates.csv' file (patch objects)
 */
function import_security_updates(){

    //check the user hasn't forgotten to upload the security updates file
    if(security_updates_file == null){
        return null;
    }

    //turn the lines into an array
    let lines = security_updates_file.split('\n');

    //import all patches as patch objects
    let security_updates = [];
    for(let i=0; i<lines.length; i++){
        //skip the heading line if it exists and blank lines
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("Date,Product") == -1){
            //check for nested commas
            lines[i] = strip_nested_commas(lines[i]);
            let params = lines[i].split(",");
            security_updates.push(new patch(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8]));
        }
    }
    return security_updates;
}

/**
 * Parse the text in the known_issues textarea and turn it into an array of known_issue objects.
 *
 * @returns {[]|undefined}: an array of known_issue objects
 */
function import_known_issues(){

    //check if the user has put anything in the known_issues textarea
    let raw = document.getElementById("known_issues").value;
	if(raw == undefined || raw == ""){
		return undefined;
	}

	//turn the text into an array of lines
    let lines = raw.split('\n');

	//import all known issues as known_issue objects
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

/**
 * Parse the patchsort-master.csv file and return an array of rgroup objects
 *
 * @returns {null|[]}: an array of rgroup objects
 */
function import_master_list(){

    //check if the user has forgotten to upload the master file
    if(master_file == null){
        return null;
    }

    //turn the file into an array of lines
    let lines = master_file.split('\n');

    //import the lines as rgroup objects
    let master_list = [];
    for(let i=0; i<lines.length; i++){
        //skip the heading line
        if(lines[i] != null && lines[i] != "" && lines[i].indexOf("product,group") == -1){
            let params = lines[i].split(",");
            master_list.push(new rgroup(params[0].trim(), params[1].trim()));
        }
    }
    return master_list;
}

/**
 * Iterate through the master_list array and return a list of unique groups
 *
 * @param rgroups: the master_list array (rgroup objects)
 */
function collect_groups(rgroups){
    //collate a list of groups
    let group_list = [];
    for(let i=0; i<rgroups.length; i++) {
        if(group_list.indexOf(rgroups[i].group_name) == -1){
            group_list.push(rgroups[i].group_name);
        }
    }
    return alphabetize(group_list);
}

/**
 * Object for master_list array - contains:
 * - a product
 * - the responsible group (rgroup) for that product
 */
class rgroup{
    constructor(product, rgroup){
        this.group_name = rgroup;
        this.product = product;
    }
}

/**
 * Object for patch array - contains:
 *  - date of patch
 *  - product to which patch applies
 *  - the product family of the product
 *  - the platform upon which the product runs
 *  - the associated KB article
 *  - the severity and impact of the vulnerability being patched
 *  - the associate CVE
 */
class patch{
    constructor(date, product, product_family, platform, article, download, severity, impact, details){
        this.date = date;
        this.product = product;
        this.product_family = product_family;
        this.platform = platform;
        this.article = article;
        this.download = download;
        this.severity = severity;
        this.impact = impact;
        this.details = details;
    }
}

/**
 * Object for known_issues array - contains:
 *  - a KB article number
 *  - the product to which it applies
 */
class known_issue{
    constructor(kb, product){
        this.kb = kb;
        this.product = product;
    }
}