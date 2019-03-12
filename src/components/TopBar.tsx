import * as React from "react";
import { SearchBar } from "./SearchBar";


export class TopBar extends React.Component {

    render() {
        return <div className={"header"}>
            <a title="Til forsiden" href="/default.htm">Til forsiden</a>
        </div>
    }
}