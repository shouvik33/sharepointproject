import * as React from 'react';
import styles from './ProjectDemo.module.scss';
import { IProjectDemoProps } from './IProjectDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import  {ProjectStates} from './ProjectStates';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IStackTokens, Stack } from 'office-ui-fabric-react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { sp } from "@pnp/sp/presets/all";
import { ValuePosition } from 'office-ui-fabric-react';
import
 {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
export default class ProjectDemo extends React.Component<IProjectDemoProps,ProjectStates, {}> {
  constructor(props){
   super (props);
   this.state={
     OrderTitle:0,
     CustomerID:0,
     CustomerName:"",
     CustomerEmailAddress:"",
     ProductID:0,
     ProductName:"",
     ProductUnitPrice:0,
     ProductExpirydate:new Date(),
     ConvertDate:"",
     ProductType:"",
     OrderID:0,
     UnitsSold:0,
     UnitPrice:0,
     SaleValue:0,
     onSubmission: false,
     required:"This is required",
     CustItems:[],
     ProdItems:[],
   };
   this.handleName = this.handleName.bind(this); 
   this.handleProduct = this.handleProduct.bind(this);
   this.handleNumber=this.handleNumber.bind(this);
   this.handleSubmit=this.handleSubmit.bind(this);
  }
  public async componentDidMount(): Promise<void>
  {
    sp.web.lists.getByTitle("Customers").items().then((items) => {  
      this.setState({  
          CustItems: items  
      }); 
  }).catch((err) => {  
      console.log(err);  
  });
  sp.web.lists.getByTitle("Products").items().then((items) => {  
    this.setState({  
        ProdItems: items  
    });  
}).catch((err) => {  
    console.log(err);  
});
    
  }
  private handleName(event): void {
    this.custautopopulate(event.target.value);
    return this.setState({
      CustomerName: event.target.value
    });
  }
  private handleProduct(event): void {
    this.autopopulate( event.target.value);
    return this.setState({
      ProductName: event.target.value
    });
  }
  private handleNumber(event): void {
    var b=this.state.ProductUnitPrice;
    return this.setState({
      UnitsSold: event.target.value,
      SaleValue:event.target.value*b
    });
  }
  private autopopulate(aa :string): void {
        var a=this.state.ProdItems;
       for(var k=0; k<a.length; k++)
       {
         var j=a[k];
         if(j.ProductName==aa)
         {
           return this.setState({
             ProductID:j.ProductID,
             ProductType:j.ProductType, 
             ProductExpirydate:j.ProductExpirydate,
             ConvertDate:j.ProductExpirydate.toString(),
             ProductUnitPrice:j.ProductUnitPrice,
           });
         }
       }
}
private custautopopulate(cc :string): void {
  var c=this.state.CustItems;
 for(var l=0; l<c.length; l++)
 {
   var i=c[l];
   if(i.CustomerName==cc)
   {
     return this.setState({
       CustomerID:i.CustomerID,
     });
   }
 }
}
private async addItem():Promise<void>{

  sp.web.lists.getByTitle("Orders").items.add({
    Title: this.state.OrderTitle.toString(),
    OrderID: this.state.OrderID,
    CustomerID: this.state.CustomerID,
    ProductID: this.state.ProductID,
    UnitsSold: this.state.UnitsSold,
    UnitPrice: this.state.ProductUnitPrice,
    SaleValue: this.state.SaleValue,
  }).then((items:any)=>{
  this.setState({
    OrderID:this.state.OrderID+1,
    OrderTitle:this.state.OrderTitle+1
  }
  );
  alert("You have successfully submitted the order");}).catch((err) => {  
    console.log(err);  
});    

}
  private handleSubmit(event): void {
    event.preventDefault();
    this.addItem();
    
  }
  public render(): React.ReactElement<IProjectDemoProps> {
    
    return (
      <form onSubmit={this.handleSubmit}>
      <div className={ styles.projectDemo }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Order Form</span>
              <div>
                <label>
                  Customer Name
                </label>
                <select onChange={this.handleName}>
                {this.state.CustItems.map((nameob) => <option key={nameob.CustomerName} value={nameob.CustomerName}>{nameob.CustomerName}</option>)}
                </select><br/>
                <label>
                  Product Name
                  <select onChange={this.handleProduct}>
                  {this.state.ProdItems.map((product) => <option key={product.ProductName} value={product.ProductName}>{product.ProductName}</option>)}
                  </select>
                  </label><br/>
                  <label>
        Product Type
        <input
        type='text' value={this.state.ProductType} disabled
      />
        </label><br/>
        <label>
        Product Expiry date
        <input
        type='text' value={this.state.ConvertDate} disabled
      />
        </label><br/>
        <label>
        Product Unit Price
        <input
        type='text' value={this.state.ProductUnitPrice} disabled
      />
        </label><br/>
        <label>
         Units Sold
        <input
        type='number' value={this.state.UnitsSold} onChange={this.handleNumber}
      />
        </label><br/>
        <label>
        Sale value
        <input
        type='number' value={this.state.SaleValue} disabled
      />
        </label><br/>
        <button type='submit'>Submit</button>
        </div>
              </div>
              
              
            </div>
          </div>
        </div>
        </form>
    );
  }
}

