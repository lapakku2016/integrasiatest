import React from 'react';
import { Link } from 'react-router-dom';

class List extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {users: []};
		this.headers = [
			{ key: 'id', label: 'Id'},
			{ key: 'name', label: 'Name' },
			{ key: 'role', label: 'Role' }
		];
		this.deleteWebsite = this.deleteWebsite.bind(this);
	}
	
	componentDidMount() {
		fetch('/users', {method: "GET"})
			.then(response => {
				return response.json();
			}).then(result => {
				console.log(result);
				this.setState({
					users:result.result
				});
			});
    }
    
	
	deleteWebsite(id) {
		if(window.confirm("Are you sure want to delete?")) {
			fetch('/user?id=' + id, {
                                method : 'DELETE'
                                   }).then(response => { 
					if(response.status === 200) {
						alert("Website deleted successfully");
                                                fetch('/users', {method: "GET"})
						.then(response => {
							return response.json();
						}).then(result => {
							console.log(result);
							this.setState({
								users:result.result
							});
						});
					} 
			 });
		}
    }
    

	
	render() {
		return (
			<div id="container">
				<Link to="/create">Add User</Link>
				<p/>
				<table>
					<thead>
						<tr>
						{
							this.headers.map(function(h) {
								return (
									<th key = {h.key}>{h.label}</th>
								)
							})
						}
						  <th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.users.map(function(item, key) {
							return (
								<tr key = {key}>
								  <td>{item.Id}</td>
								  <td>{item.Name}</td>
								  <td>{item.Role_Name}</td>
								  <td>
										<Link to={`/update/${item.Id}`}>Edit</Link> 
										&nbsp;&nbsp;
										<a href="javascript:void(0);" onClick={this.deleteWebsite.bind(this, item.Id)}>Delete</a>
										&nbsp;&nbsp;
										<Link to={`/usermenu/${item.Id}`}>Usermenu</Link> 
								  </td>
								</tr>
											)
							}.bind(this))
						}
					</tbody>
				</table>
			</div>
		)
	}
}

export default List;