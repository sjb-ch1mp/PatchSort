function patchsort(){

    //Load all files and lists
    let master_list = import_master_list();
    if(master_list == null){
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
    console.log("Files loaded successfully.");

    //collect patches for each group
    let results = [];
    let group_list = collect_groups(master_list);
    for(let i=0; i<group_list.length; i++) {

        //collect all the lists for this group
        let group_products = [];
        let group_critical_cve = [];
        let group_important_cve = [];
        let group_moderate_cve = [];
        let group_low_cve = [];
        let group_articles = [];
        let group_known_issues = [];
        let group = group_list[i];
        for(let j=0; j<patches.length; j++){
            if(is_responsible(patches[j].product, patches[j].platform, master_list, group)){

                if(group_products.indexOf(patches[j].product) == -1){
                    group_products.push(patches[j].product);
                }

                switch(patches[j].severity){
                    case "Critical":
                        if(group_critical_cve.indexOf(patches[j].details) == -1){
                            group_critical_cve.push(patches[j].details);
                        }
                        break;
                    case "Important":
                        if(group_important_cve.indexOf(patches[j].details) == -1){
                            group_important_cve.push(patches[j].details);
                        }
                        break;
                    case "Moderate":
                        if(group_moderate_cve.indexOf(patches[j].details) == -1){
                            group_moderate_cve.push(patches[j].details);
                        }
                        break;
                    default:
                        if(group_low_cve.indexOf(patches[j].details) == -1){
                            group_low_cve.push(patches[j].details);
                        }
                }

                if(is_article(patches[j].article) && group_articles.indexOf(patches[j].article) == -1){
                    group_articles.push(patches[j].article);
                }

                if(!no_known_issues){
                    let idx = known_issues.indexOf(patches[j].article);
                    if(idx > -1){
                        group_known_issues.push(known_issues[idx].kb + ": " + known_issues[idx].product);
                    }
                }
            }
        }

        //add all the details for this group to the results
        alphabetize(group_products);
        alphabetize(group_critical_cve);
        alphabetize(group_important_cve);
        alphabetize(group_moderate_cve);
        alphabetize(group_low_cve);
        alphabetize(group_articles);
        alphabetize(group_known_issues);
        results.push("\n== List for " + group + " ==\n");
        results.push("\nProducts:\n\n");
        for(let j=0; j<group_products.length; j++){
            results.push(group_products[j] + "\n");
        }
        results.push("\nDetails:\n");
        if(group_critical_cve.length > 0){
            results.push("\nCritical\n\n");
            for(let j=0; j<group_critical_cve.length; j++){
                results.push(group_critical_cve[j] + "\n");
            }
        }
        if(group_important_cve.length > 0){
            results.push("\nImportant\n\n");
            for(let j=0; j<group_important_cve.length; j++){
                results.push(group_important_cve[j] + "\n");
            }
        }
        if(group_moderate_cve.length > 0){
            results.push("\nModerate\n\n");
            for(let j=0; j<group_moderate_cve.length; j++){
                results.push(group_moderate_cve[j] + "\n");
            }
        }
        if(group_low_cve.length > 0){
            results.push("\nLow\n\n");
            for(let j=0; j<group_low_cve.length; j++){
                results.push(group_low_cve[j] + "\n");
            }
        }
        results.push("\nArticles:\n\n");
        for(let j=0; j<group_articles.length; j++){
            results.push(group_articles[j] + "\n");
        }
        if(no_known_issues){
            results.push("\nNo known issues.\n\n");
        }else{
            results.push("\nKnown Issues Apply To:\n\n");
            for(let j=0; j<known_issues.length; j++){
                results.push(known_issues[j]);
            }
        }
    }

    //prompt the user to download the sorting results
    download_results(results);
}