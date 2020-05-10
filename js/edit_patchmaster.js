let unassigned_products = null;
let group_list = null;

function launch_patchmaster_editor(patches, master_list){
    document.getElementById("div-mf").remove();
    document.getElementById("div-su").remove();
    document.getElementById("div-ki").remove();
    load_patchmaster_table(patches, master_list);
}

function load_patchmaster_table(patches, master_list){
    //build the combobox
    group_list = collect_groups(master_list);
    let combo_box = create_combo_box();

    //get the unassigned products
    unassigned_products = collect_unassigned_products(patches, master_list);
    alphabetize(unassigned_products);

    //build the patchmaster table
    let patchmaster_table = "<table class='pm'>\n";
    patchmaster_table += "<tHead><td class='pm-header'>> PRODUCT</td><td class='pm-header'>> RESPONSIBLE GROUP</td></tHead>\n";
    //FIXME: commented out platform column - makes the editor too long
    //patchmaster_table += "<tHead><td class='pm-header'>> PRODUCT</td><td class='pm-header'>> PLATFORM</td><td class='pm-header'>> RESPONSIBLE GROUP</td></tHead>\n";
    for(let i=0; i<unassigned_products.length; i++){
        //let platform = (unassigned_products[i].split(",")[1] == "")?"-":unassigned_products[i].split(",")[1];
        patchmaster_table += "<tr class='pm-table'><td class='pm-data'>" + unassigned_products[i].split(",")[0] + "</td>"
        patchmaster_table += "<td>" + combo_box.replace(new RegExp("replace_me", "g"), "" + i);
        //patchmaster_table += "<td class='pm-data-mid'>" + platform + "</td><td>" + combo_box.replace("replace_me", "cb_" + i);
    }
    patchmaster_table += "</table>\n";
    patchmaster_table += "<br/><table><tr><td class='pm-button'><button class='pm-table' onclick='create_new_master()'>> SAVE</button></td>"
    patchmaster_table += "<td class='pm-button'><button class='pm-table' onclick='location.reload()'>> CANCEL</button></td></tr>\n";

    //add table to page
    document.getElementById("div-body").innerHTML = patchmaster_table;
}

function create_combo_box(){
    let combo_box = "<select id='cb_replace_me'><option>UNASSIGNED</option>";
    for(let i=0; i<group_list.length; i++){
        if(group_list[i] != "UNASSIGNED"){
            combo_box += "<option>" + group_list[i] + "</option>"
        }
    }
    combo_box += "</select>";
    combo_box += "<button class='add_group' id='add_group_replace_me' onclick='add_group(\"add_group_replace_me\")'>+</button>"
    return combo_box;
}

function create_new_master(){

    let new_master = [];
    new_master.push("product,group\n");
    for(let i=0; i<master_list.length; i++){
        new_master.push(master_list[i].product + "," + master_list[i].group_name + "\n");
    }

    for(let i=0; i<unassigned_products.length; i++){
        //add the first group
        let master_idx = new_master.indexOf(unassigned_products[i].split(",")[0] + ",UNASSIGNED\n");
        new_master[master_idx] = unassigned_products[i].split(",")[0] + "," + document.getElementById("cb_" + i).value + "\n";

        //add any other groups for this product
        let secondary_group = null;
        let secondary_idx = 1;
        while((secondary_group = document.getElementById("cb_" + i + "_" + secondary_idx)) != null){
            new_master.push(unassigned_products[i] + "," + secondary_group.value + "\n");
            secondary_idx++;
        }

        /*
        if(is_new_product(unassigned_products[i].split(",")[0], master_list)){
            new_master.push(unassigned_products[i].split(",")[0] + "," + document.getElementById("cb_" + i).value + "\n");
        }else{
            let idx = new_master.indexOf(unassigned_products[i].split(",")[0] + ",UNASSIGNED\n");
            new_master[idx] = unassigned_products[i].split(",")[0] + "," + document.getElementById("cb_" + i).value + "\n";
        }
        */
    }

    download_results(new_master, true);
}

function add_group(add_group_id){
    let id = add_group_id.replace("add_group_", "");
    let sub_id = "1";
    if(id.indexOf("_") > -1){
        sub_id = id.split("_")[1];
        sub_id++;
        id = id.split("_")[0];
    }
    let new_combo_box = create_combo_box();
    document.getElementById(add_group_id).outerHTML = new_combo_box.replace(new RegExp("replace_me", "g"), id + "_" + sub_id);
}
