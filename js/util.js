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
    let i = 0;
    while(line.charAt(i) in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']){
        i++;
    }
    return i;
}

function check_ki_contents(){

    //if there's no text in the text area - do nothing
    if(document.getElementById("known_issues").value == ""){
        return;
    }

    //if the no known issues checkbox is checked - inform user that their entries will be ignored
    if(document.getElementById("no_known_issues").checked){
        document.getElementById("known_issues_status").innerText = "The 'No Known Issues' button is checked. Text in the Known Issues text box will be ignored!";
        return;
    }

    //otherwise check the contents of the known issues textarea
    let text = document.getElementById("known_issues").value;
    let headers = text.split('\n')[0];
    if(headers.indexOf("KB Article") != -1 && headers.indexOf("Applies To") != -1){
        document.getElementById("known_issues_status").innerText = "Known issues ready!";
    }else{
        document.getElementById("known_issues_status").innerText = "Hmmm... That doesn't look like a known issues table. Please include the headers of the known issues table or tick 'No Known Issues' if there are no known issues.";
    }
}