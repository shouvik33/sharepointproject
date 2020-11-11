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
     modifyIDs:[],
     modifiedID:0,
   };
   
   this.handleName = this.handleName.bind(this); 
   this.handleProduct = this.handleProduct.bind(this);
   this.handleNumber=this.handleNumber.bind(this);
   this.handleSubmit=this.handleSubmit.bind(this);
   this.deleteOrder=this.deleteOrder.bind(this);
   this.editOrder=this.editOrder.bind(this);
   this.resetOrder=this.resetOrder.bind(this);
   this.retrieveDetails=this.retrieveDetails.bind(this);
   this.addItem=this.addItem.bind(this);
  }


//called after render. Reads Customers List, Products List and Orders List and sets the required variables accordingly.
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

sp.web.lists.getByTitle("Orders").items().then((items) => {  
  this.setState({  
    OrderID: items.length+1,
    modifyIDs:items
  });

}).catch((err) => {  
  console.log(err);  
}); 
  }



  //Used to set the customername and customerID
  private handleName(event): void {
    this.custautopopulate(event.target.value);
    return this.setState({
      CustomerName: event.target.value
    });
  }

  //Used to set the Product Name and Autopopulate the required Fields
  private handleProduct(event): void {
    this.autopopulate( event.target.value);
    return this.setState({
      ProductName: event.target.value
    });
  }

// Used to Calculate total cost
  private handleNumber(event): void {
    var b=this.state.ProductUnitPrice;
    return this.setState({
      UnitsSold: event.target.value,
      SaleValue:event.target.value*b
    });
  }


//Used for autopupate certain fields
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


//Used to match and set Customer ID
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


//Creates/Adds new Order to the Orders List(CRUD)
private async addItem(event):Promise<void>{
  event.preventDefault();
  sp.web.lists.getByTitle("Orders").items.add({
    Title: this.state.OrderID.toString(),
    OrderID: this.state.OrderID,
    CustomerID: this.state.CustomerID,
    ProductID: this.state.ProductID,
    UnitsSold: this.state.UnitsSold,
    UnitPrice: this.state.ProductUnitPrice,
    SaleValue: this.state.SaleValue,
  }).then((items:any)=>{
  this.setState({
    OrderID:this.state.OrderID+1,
    OrderTitle:this.state.OrderID+1
  }
  );

  alert("You have successfully submitted");
  this.syncronize();
}).catch((err) => {  
    console.log(err);
      
});
   


//Used to reset all fields
}
private resetOrder(event):void{
  event.preventDefault();

  this.setState({
    UnitsSold:0,
    ProductType:"",
    SaleValue:0,
    ProductUnitPrice:0,
    ProductExpirydate:new Date(),
    ConvertDate:"",

  });

}


//Used for Updating an Existing order(CRUD)
private async editOrder(event):Promise<void>{
  event.preventDefault();
  sp.web.lists.getByTitle("Orders").items.getById(this.state.modifiedID).update({    

    CustomerID: this.state.CustomerID,
    ProductID: this.state.ProductID,
    UnitsSold: this.state.UnitsSold,
    UnitPrice: this.state.ProductUnitPrice,
    SaleValue: this.state.SaleValue,

      

 }).then((items:any)=>{
  alert("You have successfully Updated");
  this.syncronize();


 }).catch((err) => {  
  console.log(err);  
});    


}


//Used to get the latest order Ids after deletion/updation.(CRUD)
private async syncronize():Promise<void>{


  sp.web.lists.getByTitle("Orders").items().then((items) => {  
    this.setState({  
      
      modifyIDs:items,
    });
  
  }).catch((err) => {  
    console.log(err);  
  }); 
  
  

}



//Used to delete an existing Order(CRUD)
private async deleteOrder(event):Promise<void>{
  event.preventDefault();

     sp.web.lists.getByTitle("Orders").items.getById(this.state.modifiedID).delete().then((items:any)=>{
      alert("You have successfully Deleted");
      this.syncronize();

    
    
     }).catch((err) => {  
      console.log(err);  
    });       


}


//sets the orderid which should be updated or deleted
private async retrieveDetails(event):Promise<void>{
  this.setState({
    modifiedID:event.target.value,
  });




}



//Submit EventListener
  private handleSubmit(event): void {
    event.preventDefault();
    //this.addItem();
    
  }
  public render(): React.ReactElement<IProjectDemoProps> {
    
    return (
      <div >
      <form >
      <div className={ styles.projectDemo }>
        <div className={ styles.container }>
        <div className={styles.box}>
          <div className={ styles.row }>
            <div className={ styles.column }>
            
            <h1><span className={ styles.title }>Ragers Ignition - Place your dream Order</span></h1>

              <div className="ms-Grid-row">
              <div  className="ms-Grid-col ms-u-sm8 block"></div>
              <div  className="ms-Grid-col ms-u-sm8 block"></div>
              <div  className="ms-Grid-col ms-u-sm8 block"></div>
              <div  className="ms-Grid-col ms-u-sm8 block"></div></div>
              <div className="custom" >


                <div  className="ms-Grid-col ms-u-sm4 block"> 
                <label className="ms-Label">
                  Customer Name
                </label>
                </div>
                <div className="ms-Grid-col ms-u-sm8 block">
                <select onChange={this.handleName}>
                {this.state.CustItems.map((nameob) => <option key={nameob.CustomerName} value={nameob.CustomerName}>{nameob.CustomerName}</option>)}
                </select><br/>
                </div>




                <div  className="ms-Grid-col ms-u-sm4 block"> 
                <label className="ms-Label">
                  Product Name
                  </label>
                  </div>
                  <div className="ms-Grid-col ms-u-sm8 block">
                  <select onChange={this.handleProduct}>
                  {this.state.ProdItems.map((product) => <option key={product.ProductName} value={product.ProductName}>{product.ProductName}</option>)}
                  </select><br/>
                  </div>




                  <div  className="ms-Grid-col ms-u-sm4 block"> 
                  <label className="ms-Label">
        Product Type
        </label></div>
        <div className="ms-Grid-col ms-u-sm8 block">
        <input
        type='text' value={this.state.ProductType} disabled
      />
      </div>




      <div  className="ms-Grid-col ms-u-sm4 block"> 
                  <label className="ms-Label">
        Product Expiry date</label></div>
        <div className="ms-Grid-col ms-u-sm8 block">
        <input
        type='text' value={this.state.ConvertDate} disabled
      /></div>




       
       <div  className="ms-Grid-col ms-u-sm4 block"> 
                  <label className="ms-Label">
        Product Unit Price</label></div>
        <div className="ms-Grid-col ms-u-sm8 block">
        <input
        type='text' value={this.state.ProductUnitPrice} disabled
      /></div>




        <div  className="ms-Grid-col ms-u-sm4 block"> 
                  <label className="ms-Label">
         Units Sold</label></div>
         <div className="ms-Grid-col ms-u-sm8 block">
        <input
        type='number' value={this.state.UnitsSold} onChange={this.handleNumber}
      /></div>




        
        <div  className="ms-Grid-col ms-u-sm4 block"> 
                  <label className="ms-Label">
        Sale value</label></div>
        <div className="ms-Grid-col ms-u-sm8 block">
        <input
        type='number' value={this.state.SaleValue} disabled
      /></div>



        
        <div >
        <button onClick={this.addItem}>Submit</button>
        
        <button onClick={this.resetOrder}>Reset</button></div>
       <div className="ms-Grid-col ms-u-sm12 block"></div>


        <div><span className={ styles.title }>Edit or Delete  from Existing Orders </span></div>

        <div  className="ms-Grid-col ms-u-sm4 block"> 
                <label className="ms-Label">
                  Order ID
                </label>
                </div>
                <div className="ms-Grid-col ms-u-sm8 block">
                <select onChange={this.retrieveDetails}>
                {this.state.modifyIDs.map((order) => <option key={order.ID} value={order.ID}>{order.OrderID}</option>)}
                </select><br/>
                </div>


                
                <div >
        <button onClick={this.editOrder}>Update</button>
        
        <button onClick={this.deleteOrder}>Delete</button></div>       
        




        </div>
              </div>
              </div>
              
              
            </div>
          </div>
        </div>
        </form>
        </div>
    );
  }
}

