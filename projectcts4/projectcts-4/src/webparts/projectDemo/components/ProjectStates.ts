import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';

export interface ProjectStates{
    OrderTitle: number;
    CustomerName: string;
    CustomerID: number;
    CustomerEmailAddress: string;
    ProductName: string;
    ProductID: number;
    ProductExpirydate: Date;
    ProductUnitPrice: number;
    ProductType: string;
    OrderID:number;
    UnitsSold: number;
    UnitPrice: number;
    SaleValue: number;
    onSubmission:boolean;
    required: string;
    CustItems:any;
    ProdItems:any;
    ConvertDate: string;
}