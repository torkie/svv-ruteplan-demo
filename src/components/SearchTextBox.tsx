import * as React from "react";
import Autosuggest from 'react-autosuggest';
import {GeocodeService, IGeocodeService} from "../providers/GeocodeProvider";
import Popper from '@material-ui/core/Popper';
import { AddressItem } from "../Model/AddressItem";
import { withStyles, TextField, MenuItem, Paper } from "@material-ui/core";
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

export interface SearchBoxProps {
    title : string;
    value : AddressItem;
    onResult?: (item : AddressItem) => void
}

export interface SearchBoxState {
  value: string;
  suggestions: AddressItem[];
}

class SearchTextBox extends React.Component<SearchBoxProps,SearchBoxState> {
    searchProvider : IGeocodeService = new GeocodeService();
    state = {
      value: this.props.value != null ? this.props.value.name : '',
      suggestions: [] as AddressItem[],
    };


    renderInputComponent(inputProps : any) {
      const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    
      return (
        <TextField
          fullWidth
          InputProps={{
            inputRef: node => {
              ref(node);
              inputRef(node);
            },
            classes: {
              input: classes.input,
            },
          }}
          {...other}
        />
      );
    }
    renderSuggestion(suggestion : AddressItem, { query, isHighlighted } :any) {
      const matches = match(suggestion.name, query);
      const parts = parse(suggestion.name, matches);
    
      return (
        <MenuItem selected={isHighlighted} component="div">
          <div>
            {parts.map((part : any, index : number) =>
              part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500, fontSize: '1.2rem' }}>
                  {part.text}
                </span>
              ) : (
                <strong key={String(index)} style={{ fontWeight: 300, fontSize: '1.2rem' }}>
                  {part.text}
                </strong>
              ),
            )}
          </div>
        </MenuItem>
      );
    }

    handleChange = (name : any) => (event : React.ChangeEvent<HTMLInputElement>, { newValue } : any) => {
      this.setState({
        [name]: newValue,
      } as any);
    };

    handleSuggestionsFetchRequested = async ({ value } : any) => {
      let suggestions = await this.getSuggestions(value);
      this.setState({
        suggestions: suggestions.slice(0,15)
      });
    };
  
    handleSuggestionsClearRequested = () => {
      this.setState({
        suggestions: [],
      });
    };

    handleSuggestionSelected = (event: any, value : {suggestion : AddressItem, suggestionValue: string, suggestionIndex: number})  => {
      if (this.props.onResult != null)
      {
        this.props.onResult(value.suggestion);
      }
    }

    async getSuggestions(value : any) : Promise<AddressItem[]> {
      return this.searchProvider.geocodeLocation(value);
      }

    popperNode : HTMLElement;

    getSuggestionValue(suggestion : AddressItem) : string {
      return suggestion.name;
    }
        
    render() {
        const { classes } = this.props as any;

        return <div className={classes.root}>
        <Autosuggest renderInputComponent={this.renderInputComponent} suggestions={this.state.suggestions} onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested} onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected} getSuggestionValue={this.getSuggestionValue} renderSuggestion={this.renderSuggestion}
       inputProps={{
         classes,
         label: this.props.title,
         placeholder: 'Sök adress',
         value: this.state.value,
         onChange: this.handleChange('value'),
         inputRef: (node : any) => {
           this.popperNode = node;
         },
         InputLabelProps: {
           shrink: true,
         },
       }}
       theme={{
         suggestionsList: classes.suggestionsList,
         suggestion: classes.suggestion,
         suggestionsContainer: classes.suggestionContainer
       }}
       renderSuggestionsContainer={options => (
         <Popper anchorEl={this.popperNode} open={Boolean(options.children)} style={{zIndex: 1200}}>
           <Paper
             square
             {...options.containerProps}
             style={{width: 380 }}
           >
             {options.children}
           </Paper>
         </Popper>
       )}
     />
       </div>;
    }
}



const styles = (theme:any) => ({
    root: {
      width: '100%',
      flexGrow: 1,
      padding: 10,
      fontSize: '14px important'
    },
    input: {
      fontSize: '1.4rem'
    },
    container: {
      position: 'relative' as 'relative',
    },
    suggestionsContainerOpen: {
      position: 'absolute' as 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    suggestion: {
      display: 'block',
      fontSize: '1.2rem'
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
  });


  export default withStyles(styles)(SearchTextBox);