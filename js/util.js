function strip_nested_commas(line){
    if(line.indexOf("\"") != -1){
        var index_first_quote = line.indexOf(",\"");
        var index_last_quote = line.indexOf("\",");
        return line.substring(0, index_first_quote + 1) + line.substring(index_first_quote + 2, index_last_quote).replace(",", "") + line.substring(index_last_quote + 1);
    }else{
        return line;
    }
}

function get_first_space(line){
    var i = 0;
    while(line.charAt(i) in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']){
        i++;
    }
    return i;
}