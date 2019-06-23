import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user_id:'',menus:[]};
  }

  componentDidMount() {

    fetch('/menus')
        .then(response => {
            return response.json();
        }).then(result => {
            
            var rs = result.result;

            for(var i=0;i<rs.length;i++){
                var r = rs[i];
                var menu = {label : r.Name, value : r.Id};
                this.state.menus.push(menu);
            }

        });


        fetch('/user/' + this.props.match.params.id)
		.then(response => {
			return response.json();
		}).then(result => {
			console.log(result);
			this.setState({
				user_id:result.result.Id
			});
        });
        
}


  render() {

    return (
		<div id="container">
		  <Link to="/">List User</Link>
			  <p/>
			  <form>

              <input type="hidden" name="user_id" value={this.state.user_id}/>
				
                <label>Menu:</label>

                <Select
                    name="menu_id"
                    options={this.state.menus}
                    isMulti={true}
                />

				<p>
					<input type="submit" value="Submit" />
				</p>
			  </form>
		   </div>
    );
  }
}

export default Menu;