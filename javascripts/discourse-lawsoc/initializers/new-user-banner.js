import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";

export default {
    name:'new-user-banner',
    initialize(){
        withPluginApi('0.8.8', api => {  
            const timesIcon = iconNode('times');

            const buttonsArr = settings.new_user_banner_buttons.split('|');
            const buttons = buttonsArr.map(x=>x.split(',').map(y=>y.trim()));
            let username = '';
            
            const currentUser = api.getCurrentUser();
            if(currentUser){
              username = currentUser.username;
            }
            
            api.createWidget("hide-btn",{
              tagName:'button.close-banner.btn',
              buildKey:()=>'hide-btn',
              html(){
                return timesIcon;
              },
              click(){
                this.sendWidgetAction('hide');
              }
            });
            
            api.createWidget("new-user-banner", {
              tagName: "div.my-widget",
              buildKey: ()=>'new-user-banner',
              defaultState(){
                return { userHidden: true, loaded:false };
              },
              hide(){
                this.state.userHidden = true;
            
                // Update the user's profile
                if(username){
                  $.ajax({
                      url: '/u/' + username + '.json',
                      type: 'PUT',
                      data: {
                        user_fields: {
                            [settings.new_user_banner_user_field_index]: 'true'
                        }
                      }
                  });
                }
              },
              html() {
                return h(`div.new-user-banner-container${this.state.userHidden?'.hidden':''}`,[
                  this.attach('hide-btn'),
                  h('h2.new-user-banner-title', settings.new_user_banner_title),
                  h('p.new-user-banner-text', settings.new_user_banner_text),
                  h('div.new-user-banner-btns', buttons.map(x=>h('a.btn.btn-primary.new-user-banner-btn',{title:x[1],href:x[2],target:`_${x[3]}`}, x[0])))
                ]);
              }
            });
            
            api.decorateWidget('new-user-banner:after', helper => {
              if(currentUser && !helper.widget.state.loaded){
                api.container.lookup('service:store').find('user', currentUser.username).then((user) => {
                  const path = window.location.pathname;
                  helper.widget.state.userHidden = !(path == '/' || path == '' || path == '/latest') || user.user_fields[settings.new_user_banner_user_field_index]=='true';
                  helper.widget.state.loaded = true;
                  helper.widget.scheduleRerender();
                });
              }
              helper.widget.appEvents.on('page:changed', () => {
                const path = window.location.pathname;
                if(!(path == '/' || path == '' || path == '/latest')){
                  helper.widget.state.userHidden = true;
                }
                helper.widget.scheduleRerender();
              });
            });
        });
    }
}