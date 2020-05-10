/**
 * == edit_patchmaster.js ==
 * This file contains all scripts related to the PatchMaster Editor.
 * @author: sjb-ch1mp
 */

let unassigned_products = null;
let group_list = null;

/**
 * This method launches the PatchMaster Editor.
 * It removes the divs related to PatchSort and replaces them
 * with the "patchmaster-table", which can be used to assign
 * groups to new products or products that are currently unassigned.
 * When the user is completed, a new patchsort-master.csv file is
 * written.
 *
 * @param patches: The array of patches from the current security update.
 * @param master_list: The array of products and their corresponding groups.
 */
function launch_patchmaster_editor(patches, master_list){

    //remove PatchSort divs
    document.getElementById("div-mf").remove();
    document.getElementById("div-su").remove();
    document.getElementById("div-ki").remove();

    //load the patchmaster-table
    load_patchmaster_table(patches, master_list);
}

/**
 * This method creates the "patchmaster-table" and writes it to the
 * document.
 *
 * @param patches: The array of patches from the current security update.
 * @param master_list: The array of products and their corresponding groups.
 */
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
    for(let i=0; i<unassigned_products.length; i++){
        patchmaster_table += "<tr class='pm-table'><td class='pm-data'>" + unassigned_products[i].split(",")[0] + "</td>"
        patchmaster_table += "<td>" + combo_box.replace(new RegExp("replace_me", "g"), "" + i);
    }
    patchmaster_table += "</table>\n";
    patchmaster_table += "<br/><table><tr><td class='pm-button'><button class='pm-table' onclick='create_new_master()'>> SAVE</button></td>"
    patchmaster_table += "<td class='pm-button'><button class='pm-table' onclick='location.reload()'>> CANCEL</button></td></tr>\n";

    //write table to page
    document.getElementById("div-body").innerHTML = patchmaster_table;
}

/**
 * This method creates the comboboxes that are used to select a
 * responsible group for a given product.
 *
 * @returns {string}: A HTML string for a <select> object.
 */
function create_combo_box(){

    //build base combobox
    let combo_box = "<select id='cb_replace_me'><option>UNASSIGNED</option>";
    for(let i=0; i<group_list.length; i++){
        if(group_list[i] != "UNASSIGNED"){
            combo_box += "<option>" + group_list[i] + "</option>"
        }
    }
    combo_box += "</select>";

    //append the 'add_group' button
    combo_box += "<button class='add_group' id='add_group_replace_me' onclick='add_group(\"add_group_replace_me\")'>+</button>"

    //return the combo_box
    return combo_box;
}

/**
 * This method creates the array for the new patchsort-master.csv file.
 */
function create_new_master(){

    //copy the existing contents from the patchsort-master.csv file into array
    let new_master = [];
    new_master.push("product,group\n");
    for(let i=0; i<master_list.length; i++){
        new_master.push(master_list[i].product + "," + master_list[i].group_name + "\n");
    }

    //replace all "UNASSIGNED" products with the user-selected groups and append
    //entries for products with multiple groups
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
    }

    //serve the file to the user
    download_results(new_master, true);
}

/**
 * This method adds a new combobox to the table for a given product.
 * This allows users to select multiple groups for a given product.
 *
 * @param add_group_id: The identifier for this product's add_group button.
 */
function add_group(add_group_id){

    //fetch the id and sub_id from the add_group button
    let id = add_group_id.replace("add_group_", "");
    let sub_id = "1";
    if(id.indexOf("_") > -1){
        sub_id = id.split("_")[1];
        sub_id++;
        id = id.split("_")[0];
    }

    //create a new combobox
    let new_combo_box = create_combo_box();

    //replace the add_group button with a new combobox and new add_group button
    document.getElementById(add_group_id).outerHTML = new_combo_box.replace(new RegExp("replace_me", "g"), id + "_" + sub_id);
}
