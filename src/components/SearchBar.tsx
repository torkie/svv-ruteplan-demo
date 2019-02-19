import * as React from "react";

import {SearchTextBox} from "./SearchTextBox";
import { AddressItem } from "../Model/AddressItem";

interface SearchBarProps{
    fromLocation: AddressItem;
    toLocation : AddressItem;
    onFromPositionSelected? : (item : AddressItem) => void;
    onToPositionSelected?: (item: AddressItem) => void;
}

export class SearchBar  extends React.Component<SearchBarProps>{
    render() {
        return <div id="searchbar">
        <h1>SVV testklient før Ruteplantjenesten</h1><SearchTextBox title="Fra" value={this.props.fromLocation} onResult={this.handleFromResult}/>
        <SearchTextBox title="Til" value={this.props.toLocation} onResult={this.handleToResult}/></div>
    }

    handleFromResult = (item: AddressItem) => 
    {
        if (this.props.onFromPositionSelected)
        {
            this.props.onFromPositionSelected(item);
        }
    }
    handleToResult = (item: AddressItem)=>
    {
        if (this.props.onToPositionSelected)
        {
            this.props.onToPositionSelected(item);
        }
    }
}