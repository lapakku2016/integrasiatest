import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';


class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', role_id:'', roles:[]};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    fetch('/roles')
        .then(response => {
            return response.json();
        }).then(result => {
            
            var rs = result.result;

            for(var i=0;i<rs.length;i++){
                var r = rs[i];
                var role = {label : r.Name, value : r.Id};
                this.state.roles.push(role);
            }

        });


}

handleChangeSelect = selectedOption => {
    console.log(`Option selected:`, selectedOption.label);
    const state = this.state
    state['role_id'] = selectedOption.value
    this.setState(state);
  };


  handleChange(event) {
	  const state = this.state
	  state[event.target.name] = event.target.value
	  this.setState(state);
  }


  handleSubmit(event) {
    event.preventDefault();

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    let data = new FormData();
    data.set('name', this.state.name);
    data.set('role_id', this.state.role_id);

    axios.post('/user',data,config).then(res => {
      console.log(res);
      if(res.status === 200) {
          alert("Website create successfully.");
      }
    })
  }
  render() {

    return (
		<div id="container">
		  <Link to="/">List User</Link>
			  <p/>
			  <form onSubmit={this.handleSubmit}>
				<p>
					<label>Name:</label> <br/>
					<input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
				</p>
                
                <label>Role:</label>

                <Select
                    name="role_id"
                    options={this.state.roles}
                    onChange={this.handleChangeSelect}
                />

				<p>
					<input type="submit" value="Submit" />
				</p>
			  </form>
		   </div>
    );
  }
}

export default Create;