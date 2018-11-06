/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Collapse, H5, Pre, Switch } from "@blueprintjs/core";

class MapComponent extends React.PureComponent {
    state = {
        isOpen: false,
        keepChildrenMounted: false,
    };


    render() {
        const options = (
                <Switch
                    checked={this.state.keepChildrenMounted}
                    label="Keep children mounted"
                    onChange={this.handleChildrenMountedChange}
                />
        );

        return (
                <div style={{ width: "400px", height: "100%", margin: 0 }}>
                    <Button onClick={this.handleClick}>{this.state.isOpen ? "Hide" : "Show"} Browse By a Map</Button>
                    <Collapse isOpen={this.state.isOpen} keepChildrenMounted={this.state.keepChildrenMounted}>
                        <img src="map_placeholder.png" width="400" height="250"></img>
                    </Collapse>
                </div>
        );
    }

    handleClick = () => this.setState({ isOpen: !this.state.isOpen });
}

export default MapComponent;