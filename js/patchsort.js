function patchsort(){

    var security_updates = import_security_updates();
    if(security_updates == null){
        alert("You need to paste the contents of the security update in the 'Security Updates' field!");
        return;
    }
    var known_issues = import_known_issues();
    if(known_issues == null){
        alert("You need to paste the table of known issues in the 'Known Issues' field!");
        return;
    }
    var responsible_groups = import_responsible_groups();
    if(responsible_groups == null){
        alert("Error importing the master list!");
        return;
    }

}


