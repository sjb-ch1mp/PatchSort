function patchsort(){
    let rgroups = import_responsible_groups();
    if(rgroups == null){
        alert("You need to upload the master file!");
        return;
    }else{
        console.log("Master file loaded successfully. Length: " + rgroups.length);
        console.log("- First group: " + rgroups[0].product);
        console.log("- Last group: " + rgroups[rgroups.length - 1].product);
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
    }else if(check_ki_contents()){
        let known_issues = import_known_issues();
        if(known_issues == null){
            alert("You need to paste the table of known issues in the 'Known Issues' field!");
            return;
        }else{
            console.log("Known Issues loaded successfully. Length: " + known_issues.length);
            console.log("- First KI: " + known_issues[0].kb + ", " + known_issues[0].product);
            console.log("- Last KI: " + known_issues[known_issues.length - 1].kb + ", " + known_issues[known_issues.length - 1].product);
        }
    }else{
        return;
    }

    console.log("== FILES LOADED SUCCESSFULLY - GOOD TO GO ==");

    /**
        File download solution: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341
     */
}


