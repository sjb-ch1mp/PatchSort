function strip_nested_commas(line){
    if(line.indexOf("\"") != -1){
        let index_first_quote = line.indexOf(",\"");
        let index_last_quote = line.indexOf("\",");
        return line.substring(0, index_first_quote + 1) + line.substring(index_first_quote + 2, index_last_quote).replace(",", "") + line.substring(index_last_quote + 1);
    }else{
        return line;
    }
}

function get_first_space(line){
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let i = 0;
    while(numbers.indexOf(line.charAt(i)) > -1){
        i++;
    }
    return i;
}

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

function get_release_notes_url(){
    return "https://portal.msrc.microsoft.com/en-us/security-guidance/releasenotedetail/" + get_date_string();
}

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

function get_known_issue(known_issues, article){
    for(let i=0; i<known_issues.length; i++){
        if(known_issues[i].kb == article){
            return known_issues[i].kb + ": " + known_issues[i].product;
        }
    }
    return undefined;
}

function collect_unassigned_products(patches, master_list){
    let unassigned_products = [];

    for(let i=0; i<patches.length; i++){
        if(is_responsible(patches[i].product, undefined, master_list, "UNASSIGNED") &&
            unassigned_products.indexOf(patches[i].product + "," + patches[i].platform) == -1){
            //get patches which exist in master list and are unassigned
            unassigned_products.push(patches[i].product + "," + patches[i].platform);
        }else if(is_new_product(patches[i].product, master_list) &&
            unassigned_products.indexOf(patches[i].product + "," + patches[i].platform) == -1){
            //get patches which do not exist in master list
            unassigned_products.push(patches[i].product + "," + patches[i].platform);
        }
    }
    return unassigned_products;
}

function is_new_product(product, master_list){
    for(let i=0; i<master_list.length; i++){
        if(master_list[i].product == product){
            return false;
        }
    }
    return true;
}