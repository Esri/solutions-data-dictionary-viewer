import {React, FormattedMessage} from 'jimu-core';
import {BaseWidgetSetting, AllWidgetSettingProps} from 'jimu-for-builder';
import {IMConfig} from '../config';
import defaultI18nMessages from './translations/default'

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, any>{
  onURLChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('url', evt.currentTarget.value)
    });
  }

  onAllowLookupChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('allowUrlLookup', evt.currentTarget.checked)
    });
  }

  render(){
    return <div className="widget-setting-demo">
      <div style={{paddingBottom:10}}><FormattedMessage id="url" defaultMessage={defaultI18nMessages.url}/>: <input defaultValue={this.props.config.url} onChange={this.onURLChange} style={{width:"90%"}}/></div>
      <div style={{paddingBottom:10}}><FormattedMessage id="allowurlLookup" defaultMessage={defaultI18nMessages.urlLookup}/>: <input type="checkbox" checked={this.props.config.allowUrlLookup} onChange={this.onAllowLookupChange} /></div>
    </div>
  }
}