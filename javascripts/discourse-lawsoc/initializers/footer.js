import { withPluginApi } from "discourse/lib/plugin-api";

export default {
    name:'custom-footer',
    initialize() {
        withPluginApi('0.8.8', api => {  
            api.registerConnectorClass('below-footer', 'custom-footer', {
                setupComponent(args, component) {
                   component.set('year', new Date().getFullYear());
                }
            });
        });
    }
}
