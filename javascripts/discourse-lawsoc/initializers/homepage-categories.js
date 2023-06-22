import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";

export default {
    name:'homepage-categories',
    initialize(){
        withPluginApi('0.8.8', api => {  
            api.registerConnectorClass('below-site-header', 'custom-homepage', {
                setupComponent(args, component) {
                    component.set('hostname', window.location.hostname);
                
                    api.onPageChange((url, title) => {
                        if (url == "/" || url == "/latest" || url == ""){ 
                            component.set('displayCustomCategories', true);
                            const site = ajax("/site.json");
                            const categories = ajax("/categories.json");          
                            Promise.all([site,categories])            
                            .then (function(results){
                                // Get list of categories
                                let categoryName = [];
                                results[1].category_list.categories.forEach(function(category){
                                    categoryName.push(category);
                                    category.subcategory_ids.forEach(function(subCatId){
                                      const subCat = results[0].categories.find(c=>c.id == subCatId);
                                      categoryName.push({...subCat,slug:`${category.slug}/${subCat.slug}`});
                                    });
                                });
                                const categroyIds = settings.categories_banner_category_ids.split('|');
                                component.set('categoryName', categroyIds.map(x=>categoryName.find(c=>c.id == x)).filter(x=>x!=null));
                            });
                        }
                        else { 
                            component.set('displayCustomCategories', false);
                        }
                    });
                }
            });
        });
    }
}