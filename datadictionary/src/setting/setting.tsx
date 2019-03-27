import {React, IMDataSourceJson, Immutable, UseDataSource, ImmutableArray, IMUseDataSource, FieldSchema, IMState, DataSource, FeatureQueryDataSource, DataSourceTypes} from 'jimu-core';
import { BaseWidgetSetting, ChooseDataSource, DataSourceJsonWithRootId, ChooseField, AllWidgetSettingProps } from "jimu-for-builder";
import {ArcGISDataSourceTypes} from 'jimu-arcgis/arcgis-data-source-type';

export default class Setting extends BaseWidgetSetting{

  onDsSelected = (dsJson: DataSourceJsonWithRootId) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      useDataSources: Immutable([{
        dataSourceId: dsJson.dataSourceJson.id,
        rootDataSourceId: dsJson.rootDataSourceId
      }]) as ImmutableArray<IMUseDataSource>
    })
  }

  render(){
    return <div className="use-feature-layer-setting p-2">
      <ChooseDataSource
        types={[ArcGISDataSourceTypes.FeatureLayer, DataSourceTypes.FeatureQuery]}
        onSelected={this.onDsSelected}
        defaultDataSourceIds={this.props.useDataSources && this.props.useDataSources.map(ds => ds.dataSourceId) as ImmutableArray<string>}
      />

    </div>
  }
}