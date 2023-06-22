import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
    name:'homepage-banner',
    initialize(){
        withPluginApi('0.8.8', api => {
            api.createWidget('homepage-banner-widget', {
                tagName: 'div.homepage-banner-container',
                html() {
                    const path = window.location.pathname;
            
                    if(path == '/' || path == '' || path == '/latest') {
                        $("body").addClass("has-homepage-banner");
              
                        return h('div.homepage-banner-inner', {}, 
                          h('div.homepage-banner-text', [
                            h('h1.title', settings.homepage_banner_header_title),
                            h('h2.subtitle', settings.homepage_banner_header_subtitle),
                            h('p', settings.homepage_banner_header_text),
                          ])
                        );
                    } else {
                        $("body").removeClass("has-homepage-banner");
                    }
                }
            }),
            
            api.decorateWidget('homepage-banner-widget:after', helper => {
                helper.widget.appEvents.on('page:changed', () => {
                    helper.widget.scheduleRerender();
                });
            });
        });
    }
}