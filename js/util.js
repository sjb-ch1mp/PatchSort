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

function check_ki_contents(){

    //if there's no text in the text area - do nothing
    if(document.getElementById("known_issues").value == ""){
        alert("There is nothing in the Known Fields text box and the 'No Known Issues' checkbox is not checked!");
        return false;
    }

    //if the no known issues checkbox is checked - inform user that their entries will be ignored
    if(document.getElementById("no_known_issues").checked){
        return true;
    }

    //otherwise check the contents of the known issues textarea
    let text = document.getElementById("known_issues").value;
    let i = 0;
    let headers = text.split('\n')[i];
    while(headers == ""){
        //iterate through text in case there are leading blank spaces
        headers = text.split('\n')[++i];
    }

    if(headers.indexOf("KB Article") != -1 && headers.indexOf("Applies To") != -1){
        return true;
    }else{
        alert("Hmmm... That doesn't look like a known issues table. Please include the headers of the known issues table or tick 'No Known Issues' if there are no known issues.");
        return false;
    }
}

function alphabetize_patches(group_patches, sort_by){
    for(let i=0; i<group_patches.length; i++){
        for(let j=i; j<group_patches.length; j++){
            if((sort_by == "product" && group_patches[i].product > group_patches[j].product) ||
                (sort_by == "details" && group_patches[i].details > group_patches[j].details) ||
                (sort_by == "article" && group_patches[i].article > group_patches[j].article)) {
                let hold = group_patches[i];
                group_patches[i] = group_patches[j];
                group_patches[j] = hold;
            }
        }
    }
    return group_patches;
}

function is_article(article){
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for(let i=0; i<article.length; i++){
        if(numbers.indexOf(article.substring(i, i+1)) == -1){
            return false;
        }
    }
    return true;
}