package main

import "database/sql"
import "fmt"
import "net/http"
import "github.com/gin-gonic/gin"
import _ "github.com/go-sql-driver/mysql"
import "log"

func main(){

	dbDriver := "mysql"
    dbUser := "root"
    dbPass := ""
	dbName := "integrasia"
	
	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@/"+dbName)
	
	if err != nil {
		fmt.Print(err.Error())
	}

	defer db.Close()

	err = db.Ping()

	if err != nil {
		fmt.Print(err.Error())
	}

	router := gin.Default()


	//Menu

	type Menu struct {
		Id         int
		Name       string
	}

	router.GET("/menus", func(c *gin.Context) {

		var (
			menu  Menu
			menus []Menu
		)

		rows, err := db.Query("select id, name from menu;")

		if err != nil {
			fmt.Print(err.Error())
		}

		for rows.Next() {
			err = rows.Scan(&menu.Id, &menu.Name)
			menus = append(menus, menu)
			if err != nil {
				fmt.Print(err.Error())
			}
		}

		defer rows.Close()

		c.JSON(http.StatusOK, gin.H{
			"result": menus,
			"count":  len(menus),
		})
	})

	//Role

    type Role struct {
		Id         int
		Name       string
	}

	router.GET("/roles", func(c *gin.Context) {

		var (
			role  Role
			roles []Role
		)

		rows, err := db.Query("select id, name from role;")

		if err != nil {
			fmt.Print(err.Error())
		}

		for rows.Next() {
			err = rows.Scan(&role.Id, &role.Name)
			roles = append(roles, role)
			if err != nil {
				fmt.Print(err.Error())
			}
		}

		defer rows.Close()

		c.JSON(http.StatusOK, gin.H{
			"result": roles,
			"count":  len(roles),
		})
	})


	//User

	type User struct {
		Id         int
		Name       string
		Role_Id    int
		Role_Name  string
	}

	router.GET("/users", func(c *gin.Context) {

		var (
			user  User
			users []User
		)

		rows, err := db.Query("select id, name, role_id, (select name from role where id = user.role_id) as role_name from user;")

		if err != nil {
			fmt.Print(err.Error())
		}

		for rows.Next() {
			err = rows.Scan(&user.Id, &user.Name, &user.Role_Id, &user.Role_Name)
			users = append(users, user)
			if err != nil {
				fmt.Print(err.Error())
			}
		}

		defer rows.Close()

		c.JSON(http.StatusOK, gin.H{
			"result": users,
			"count":  len(users),
		})
	})

	router.POST("/user", func(c *gin.Context) {

		name := c.PostForm("name")
		role_id := c.PostForm("role_id")
		stmt, err := db.Prepare("insert into user (name, role_id) values(?,?);")

		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(name, role_id)

		if err != nil {
			fmt.Print(err.Error())
		}

	
		defer stmt.Close()
		
		c.JSON(http.StatusOK, gin.H{
			"message" : "successfully created",
		})
	})

	router.GET("/user/:id", func(c *gin.Context) {

		var (
			user  User
			result gin.H
		)

		id := c.Param("id")
		row := db.QueryRow("select id, name, role_id, (select name from role where id = user.role_id) as role_name from user where id = ?;", id)
		err = row.Scan(&user.Id, &user.Name, &user.Role_Id, &user.Role_Name)

		if err != nil {
			// If no results send null
			result = gin.H{
				"result": nil,
				"count":  0,
			}
		} else {
			result = gin.H{
				"result": user,
				"count":  1,
			}
		}
		c.JSON(http.StatusOK, result)
	})

	router.POST("/userupdate", func(c *gin.Context) {

		id := c.PostForm("id")
		name := c.PostForm("name")
		role_id := c.PostForm("role_id")

		log.Print("id = " + id)
		log.Print("name = " + name)
		log.Print("role_id = " + role_id)

		stmt, err := db.Prepare("update user set name= ?, role_id= ? where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(name, role_id, id)
		if err != nil {
			fmt.Print(err.Error())
		}
		
		defer stmt.Close()

		c.JSON(http.StatusOK, gin.H{
			"message" : "successfully updated",
		})
	})

	// Delete resources
	router.DELETE("/user", func(c *gin.Context) {
		id := c.Query("id")
		stmt, err := db.Prepare("delete from user where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(id)
		if err != nil {
			fmt.Print(err.Error())
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Successfully deleted",
		})
	})

	// 



	router.Run(":3001")
}


