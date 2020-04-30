function patchsort(){
    let groups = import_groups();
    if(groups == null){
        alert("Error importing the master list!");
        return;
    }else{
        console.log("Master file loaded successfully. Length: " + groups.length);
        console.log("- First group: " + groups[0].group);
        console.log("- Last group: " + groups[groups.length - 1].group);
    }

    let security_updates = import_security_updates();
    if(security_updates == null){
        alert("You need to upload the Security Updates CSV file!");
        return;
    }else{
        console.log("Security Updates loaded successfully. Length: " + security_updates.length);
        console.log("- First patch: " + security_updates[0].product);
        console.log("- Last patch: " + security_updates[security_updates.length - 1].product);
    }

    let no_known_issues = false;
    if(document.getElementById("no_known_issues").checked) {
        no_known_issues = true;
    }else{
        let known_issues = import_known_issues();
        if(known_issues == null){
            alert("You need to paste the table of known issues in the 'Known Issues' field!");
            return;
        }else{
            console.log("Known Issues loaded successfully. Length: " + known_issues.length);
            console.log("- First KI: " + known_issues[0].kb + ", " + known_issues[0].product);
            console.log("- Last KI: " + known_issues[known_issues.length - 1].kb + ", " + known_issues[known_issues.length - 1].product);
        }
    }


}


