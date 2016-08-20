import React, { Component } from 'react';
export default class ContactList extends Component{
  constructor(props,context){
    super();
    let ct = this._retrieveContacts();
    this.state = {
      contacts : ct
    }
  }
  _reatriveContacts(){
    return;
  }
}
