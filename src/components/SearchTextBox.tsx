import * as React from "react";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

import {GeocodeService, IGeocodeService} from "../providers/GeocodeProvider";
import { AddressItem } from "../Model/AddressItem";

export interface SearchBoxProps {
    title : string;
    value : AddressItem;
    onResult?: (item : AddressItem) => void
}

export interface SearchBoxState {
    allowNew : boolean,
    isLoading: boolean,
    multiple: boolean,
    options: any[],
}

export class SearchTextBox extends React.Component<SearchBoxProps,SearchBoxState> {
    searchProvider : IGeocodeService = new GeocodeService();
    state = {
        allowNew: false,
        isLoading: false,
        multiple: false,
        options: [] as AddressItem[]
    };
        
    render() {
        return <span>{this.props.title}: <AsyncTypeahead
        {...this.state} 
        onChange={(selected : AddressItem[]) => {
            if (this.props.onResult)
            {
                this.props.onResult(selected[0]);
            }}}
        selected={this.props.value ? [this.props.value] : null}
        labelKey={(option: AddressItem) => {return option.name}}
        onSearch={this.handleSearch}
        emptyLabel="Ingen match"
        placeholder="Søk adresse, sted m.m."
        renderMenuItemChildren={(option, props) => (
            <span>{option.name}</span>
        )}
        bsSize="small"
        /></span>
    }

    handleSearch = (query: string) => {
        this.setState({isLoading: true});

        this.searchProvider.geocodeLocation(query).then((results : AddressItem[]) => 
        {
            this.setState({
                isLoading: false,
                options: results,
            });
        });

           
    }
}