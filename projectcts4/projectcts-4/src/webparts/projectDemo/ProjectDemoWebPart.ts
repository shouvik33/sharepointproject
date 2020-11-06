import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp";
import * as strings from 'ProjectDemoWebPartStrings';
import ProjectDemo from './components/ProjectDemo';
import { IProjectDemoProps } from './components/IProjectDemoProps';

export interface IProjectDemoWebPartProps {
  description: string;
}

export default class ProjectDemoWebPart extends BaseClientSideWebPart<IProjectDemoWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectDemoProps> = React.createElement(
      ProjectDemo,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
    sp.setup({
    spfxContext: this.context
    });
    });
    }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
