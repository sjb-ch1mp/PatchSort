/**
 * The util.js file contains all utility methods, that is, those methods that are helpful methods
 * used by all other scripts in PatchSort.
 *
 * @author: sjb-ch1mp
 */

/**
 * Removes confounding commas from a line in a CSV file.
 *
 * @param line: the line from the CSV file.
 * @returns {string|*}: the line without confounding commas.
 */
function strip_nested_commas(line){
    if(line.indexOf("\"") != -1){
        let index_first_quote = line.indexOf(",\"");
        let index_last_quote = line.indexOf("\",");
        return line.substring(0, index_first_quote + 1) + line.substring(index_first_quote + 2, index_last_quote).replace(",", "") + line.substring(index_last_quote + 1);
    }else{
        return line;
    }
}

/**
 * Returns the index of the first space in a line from the Known Issues textarea.
 *
 * @param line: the line from the Known Issues textarea.
 * @returns {number}: the first space in the line (specifically, the first character that isn't a number)
 */
function get_first_space(line){
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let i = 0;
    while(numbers.indexOf(line.charAt(i)) > -1){
        i++;
    }
    return i;
}

/**
 * Sorts a list into alphabetical order.
 *
 * @param list: a list of strings.
 * @returns {*}: the list in alphabetical order.
 */
function alphabetize(list){
    if(list != undefined && list.length > 1){
        for(let i=0; i<list.length; i++){
            for(let j=i; j<list.length; j++){
                if(list[i] > list[j]) {
                    let hold = list[i];
                    list[i] = list[j];
                    list[j] = hold;
                }
            }
        }
    }
    return list;
}

/**
 * Checks if an article is actually an article, that is, if it is 6 numbers and not a blank string or note.
 *
 * @param article: the article number.
 * @returns {boolean}: true if the article number is actually an article number.
 */
function is_article(article){
    if(article == undefined || article == ""){
        return false;
    }else{
        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for(let i=0; i<article.length; i++){
            if(numbers.indexOf(article.substring(i, i+1)) == -1){
                return false;
            }
        }
    }
    return true;
}

/**
 * Takes a string array and serves it to the user as a CSV or text file.
 *
 * @param results: a string array.
 * @param pm: an indicator for whether a new patchsort-master.csv file or patch-list.txt file is being served.
 */
function download_results(results, pm){
    // Adapted from: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341
    let option = (pm)?"text/csv":"text/plain";
    let file_name = (pm)?"patchsort-master.csv":"patch-lists_" + get_date_string() + ".txt";

    let blob = new Blob(results, {type: option});
    if(window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveOrOpenBlob(blob, file_name);
    }else{
        let element = window.document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = file_name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    location.reload();
}

/**
 * Checks whether a given group is responsible for a given patch.
 *
 * @param product: the product in question
 * @param platform: the platform of that product
 * @param master_list: the list of all products and their responsible group
 * @param group: the group in question
 * @returns {boolean}: true if the group in question is responsible for the product in question
 */
function is_responsible(product, platform, master_list, group){

    //if the platform exists - this means that
    //this is an application that runs on multiple
    //platforms. If the group is responsible for the
    //platform, then they are responsible for any applications
    //on that platform, and vice versa.

    let compare_to = product;
    if(platform != undefined && platform != ""){
        compare_to = platform;
    }

    for(let i=0; i<master_list.length; i++){

        if(master_list[i].product == compare_to && master_list[i].group_name == group){
            return true;
        }
    }
    return false;
}

/**
 * Calculates the date of the latest Patch Tuesday. This method accounts for the fact
 * that Patch Tuesday occurs on the SECOND TUESDAY of a given month.
 *
 * @returns {string}: the date of the current security update (<YEAR>-<Mon>)
 */
function get_date_string(){
    let d = new Date();
    let y = d.getFullYear();

    let first_day = new Date("1 " + get_month_abbreviation(d.getMonth()) + " " + y);
    let get_month = d.getMonth();

    //if it has not yet passed the second tuesday of the month
    //the latest release is the previous month
    if(first_day.getDay() == 0 && d.getDay() < 10 ||
        first_day.getDay() == 1 && d.getDay() < 9 ||
        first_day.getDay() == 2 && d.getDay() < 8 ||
        first_day.getDay() == 3 && d.getDay() < 14 ||
        first_day.getDay() == 4 && d.getDay() < 13 ||
        first_day.getDay() == 5 && d.getDay() < 12 ||
        first_day.getDay() == 6 && d.getDay() < 11){
        if(get_month == 0){
            get_month = 11;
        }else{
            get_month--;
        }
    }

    let m = get_month_abbreviation(get_month);
    return y + "-" + m;
}

/**
 * Returns the URL for the release notes of the latest security update.
 *
 * @returns {string}: the URL of the release notes for the latest security update.
 */
function get_release_notes_url(){
    return "https://portal.msrc.microsoft.com/en-us/security-guidance/releasenotedetail/" + get_date_string();
}

/**
 * Translates a month integer into an abbreviated month string.
 *
 * @param m: the month as an integer (0-11)
 * @returns {string}: the month as a string (Jan-Dec)
 */
function get_month_abbreviation(m){
    
    switch(m){
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        default:
            return "Dec";
    }
}

/**
 * Fetches the known issue string for a given article.
 *
 * @param known_issues: an array of known_issue objects
 * @param article: the article in question.
 * @returns {string|undefined}: the known issue string (<KB article number>: <Product>)
 */
function get_known_issue(known_issues, article){
    for(let i=0; i<known_issues.length; i++){
        if(known_issues[i].kb == article){
            return known_issues[i].kb + ": " + known_issues[i].product;
        }
    }
    return undefined;
}

/**
 * Collects all new products and products that are currently unassigned in the master-list.
 *
 * @param patches: array of patch objects
 * @param master_list: array of rgroup objects
 * @returns {[]}: list of products that are unassigned.
 */
function collect_unassigned_products(patches, master_list){
    let unassigned_products = [];

    //collect unassigned products from patch list
    for(let i=0; i<patches.length; i++){
        if(is_responsible(patches[i].product, undefined, master_list, "UNASSIGNED") &&
            unassigned_products.indexOf(patches[i].product) == -1){
            unassigned_products.push(patches[i].product);
        }
    }

    //collect unassigned products from master_list
    for(let i=0; i<master_list.length; i++){
        if(master_list[i].group_name == "UNASSIGNED" &&
            unassigned_products.indexOf(master_list[i].product) == -1){
            unassigned_products.push(master_list[i].product);
        }
    }

    return unassigned_products;
}

/**
 * Checks whether a product exists in the master_list
 *
 * @param product: the product in question
 * @param master_list: an array of rgroup objects
 * @returns {boolean}: true if the product exists in the master_list
 */
function is_new_product(product, master_list){
    for(let i=0; i<master_list.length; i++){
        if(master_list[i].product == product){
            return false;
        }
    }
    return true;
}