import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: '', name: '', role_id: '', role_name:'', roles:[], selectedOpt:{}};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }
  
  componentDidMount() {
	fetch('/user/' + this.props.match.params.id)
		.then(response => {
			return response.json();
		}).then(result => {
			console.log(result);
			this.setState({
				id:result.result.Id,
				name:result.result.Name,
                role_id:result.result.Role_Id,
                role_name:result.result.Role_Name,
                selectedOpt:{label:result.result.Role_Name,value:result.result.Role_Id}
			});
        });
        
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
    state['selectedOpt'] = selectedOption
    this.setState(state);
  };

  handleChange(event) {
	  const state = this.state;
      state[event.target.name] = event.target.value;
	  this.setState(state);
  }

  handleSubmit(event) {
      event.preventDefault();

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      let data = new FormData();
      data.set('id', this.state.id);
      data.set('name', this.state.name);
      data.set('role_id', this.state.role_id);

      axios.post('/userupdate',data,config).then(res => {
        console.log(res);
        if(res.status === 200) {
            alert("Website update successfully.");
        }
      })
            
          
  }
  
  render() {
    return (
			<div id="container">
			  <Link to="/">List User</Link>
				  <p/>
				  <form onSubmit={this.handleSubmit}>
					<input type="hidden" name="id" value={this.state.id}/>
						<p>
						<label>Name:</label>
							<input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
						</p>
						
                        <label>Role:</label>

                        <Select
                            options={this.state.roles}
                            onChange={this.handleChangeSelect}
                            value={this.state.selectedOpt}
                        />
						<p>
							<input type="submit" value="Submit" />
						</p>
				  </form>
			   </div>
    );
  }
}

export default Update;