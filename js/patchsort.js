function patchsort(){
    let rgroups = import_responsible_groups();
    if(rgroups == null){
        alert("You need to upload the master file!");
        return;
    }

    let patches = import_security_updates();
    if(patches == null){
        alert("You need to upload the Security Updates CSV file!");
        return;
    }

    let no_known_issues = document.getElementById("no_known_issues").checked;
    let known_issues = import_known_issues();
    if(!no_known_issues && known_issues == null){
        alert("You need to paste the table of known issues in the 'Known Issues' field!");
        return;
    }

    console.log("== FILES LOADED SUCCESSFULLY - GOOD TO GO ==");

    let group_list = collect_groups(rgroups);
    let results = [];

    //collect patches for each group
    for(let i=0; i<group_list.length; i++){

        let group = group_list[i];

        //get all products for which this group is responsible
        let products = [];
        for(let j=0; j<rgroups.length; j++){
            if(group == rgroups[j].group_name){
                products.push(rgroups[j].product);
            }
        }
        //console.log("products.length = " + products.length);

        //get all patches for which this group is responsible
        let group_patches = [];
        for(let j=0; j<patches.length; j++){
            if(products.indexOf(patches[j].product) > -1){
                if(patches[j].platform == ""){
                    //if there is no platform - the product most likely IS the platform.
                    group_patches.push(patches[j]);
                }else{
                    if(products.indexOf(patches[j].platform) > -1){
                        //those patches for applications that run on multiple platforms,
                        //e.g. Internet Explorer 11, should only be added if they are on
                        //a platform for which the group is responsible
                        group_patches.push(patches[j]);
                    }
                }
            }
        }
        group_patches = alphabetize_patches(group_patches, "product");
        //console.log("group_patches.length = " + group_patches.length);

        //add product list to results
        results.push("== LIST FOR " + group + " ==");
        results.push("");
        results.push("Products:");
        for(let j=0; j<group_patches.length; j++){
            results.push(group_patches[j].product);
        }
        results.push("");

        //group cves by severity
        group_patches = alphabetize_patches(group_patches, "details");
        let track_cve = [];
        let critical = [];
        let important = [];
        let moderate = [];
        let low = [];
        for(let j=0; j<group_patches.length; j++){
            if(track_cve.indexOf(group_patches[j].details) == -1){
                if(group_patches[j].severity == "Critical"){
                    critical.push(group_patches[j].details);
                }else if(group_patches[j].severity == "Important"){
                    important.push(group_patches[j].details);
                }else if(group_patches[j].severity == "Moderate"){
                    moderate.push(group_patches[j].details);
                }else{ //severity must be low
                    low.push(group_patches[j].details);
                }
            }
        }

        //add cve to results
        results.push("Details:");
        if(critical.length > 0){
            results.push("Critical");
            for(let j=0; j<critical.length; j++){
                results.push("\t" + critical[j]);
            }
        }
        if(important.length > 0){
            results.push("Important");
            for(let j=0; j<important.length; j++){
                results.push("\t" + important[j]);
            }
        }
        if(moderate.length > 0){
            results.push("Moderate");
            for(let j=0; j<moderate.length; j++){
                results.push("\t" + moderate[j]);
            }
        }
        if(low.length > 0){
            results.push("Low");
            for(let j=0; j<low.length; j++){
                results.push("\t" + low[j]);
            }
        }
        results.push("");
        //console.log("cves added to results");

        //get all kbs for which this group is responsible
        group_patches = alphabetize_patches(group_patches, "article");
        let kb = [];
        for(let j=0; j<group_patches.length; j++){
            if(is_article(group_patches[j].article) && kb.indexOf(group_patches[j].article) == -1){
                kb.push(group_patches[j].article);
            }
        }
        //console.log("kb.length = " + kb.length);

        //add kbs to results
        results.push("Articles:");
        for(let j=0; j<kb.length; j++){
            results.push(kb[j]);
        }
        results.push("");
        //console.log("added kbs to results");

        //add kis to results
        if(no_known_issues){
            results.push("No Known Issues");
        }else{
            results.push("Known Issues Apply To:");
            for(let j=0; j<kb.length; j++){
                for(let k=0; k<known_issues.length; k++){
                    if(kb[j] == known_issues[k].kb){
                        results.push(known_issues[k].kb + ": " + known_issues[k].product);
                    }
                }
            }
        }
        results.push("");
        //console.log("results.length = " + results.length);
    }

    for(let i=0; i<results.length; i++){
        console.log(results[i]);
    }

    /**
        File download solution: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341
     */
}