import React, { Component } from "react";
import { BrowserRouter as Routes, Router, Route, Link, redirect } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div><p>This is the Home page</p></div>
        );
    }
}