import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar";
import PlantsContainer from "./components/plants_container";
import PlantShowPage from "./components/plant_showpage";
import SignUp from "./components/sign_up";
import UserNavbar from "./components/user_navbar";
import LogIn from "./components/log_in";
import LogOut from "./components/log_out";
import Info from "./components/info";
import Identifier from "./components/identifier";
import MyGarden from "./components/my_garden";

class App extends React.Component {
 state = {
   currentUser: null,
   plants: [],
   searchTerm: "",
   currentPlant: 0,
   currentPage: 1,
   imagePath: null,
   queryImage: null
 }

 componentDidMount(){
   const user_id = localStorage.user_id

   if (user_id) {
    fetch("https://theplantaeapi.herokuapp.com/api/v1/auto_login", {
      headers: {
        "Authorization": user_id
      }
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors){
       alert(response.errors)
     } else {
        this.setUser(response)
       }
    })
  }

 }

 setUser = (user) => {
   console.log(user)
   if (user && user.errors) {
    alert(user.errors)
  } else if (user) {
    this.setState({
      currentUser: user
   },()=> {
     console.log(user)
     localStorage.user_id = user.user.id

     if(this.state.imagePath) {
     this.props.history.push('/identifier')
   } else {
     this.props.history.push('/my_garden')
   }
   })
 } else {
   this.setState({
     currentUser: user
    },()=> this.props.history.push('/'))
   }

 }

 setCurrentPlantId = (plant) => {
  this.setState({
    currentPlant: plant,
  },()=> this.props.history.push(`/plants/${plant.id}`))
 }

 setCurrentPage = pageNumer => {
  this.setState({
    currentPage: pageNumer
  },()=> this.props.history.push(`/plants/page=${pageNumer}`))
 }

 backToWol = (e, queryImage) => {
   console.log(queryImage)
  this.props.history.replace('/identifier')
  this.setState({ queryImage: queryImage})
 }

 getPlants = e => {
let API = "https://theplantaeapi.herokuapp.com/api/v1/plants"
   if (e || document.location.href == "http://localhost:3000/flowers") {
      API = "https://theplantaeapi.herokuapp.com/api/v1/flowers"
   } else if (document.location.href == "http://localhost:3000/food") {
      API = "https://theplantaeapi.herokuapp.com/api/v1/food"
   }

   fetch(API, {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
     "Accept": "application/json",
     currentPage: this.state.currentPage,
     searchTerm: this.state.searchTerm
   }
 })
 .then(res => res.json())
 .then(data => {
    if (data.errors) {
      alert(data.errors)
   } else if (data.data){
     this.setState({
       plants: data.data.data,
       currentPage: Number(data.currentPage),
       searchTerm: ""
     })
   }
  })
 }

render() {
  let navbar = <NavBar currentUser={this.state.currentUser} />;

if (this.state.currentUser) {
  navbar = <UserNavbar currentUser={this.state} setUser={this.setUser} />;
}
  console.log(this.state)
  return (
    <div className="App">
    {navbar}
    <Switch>
    <Route exact path="/" render={(routerProps)=> <PlantsContainer key={window.location.pathname} getPlants={this.getPlants} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} setUser={this.setUser} {...this.state} {...routerProps}/>}/>
    <Route exact path="/plants" render={(routerProps)=> <PlantsContainer key={window.location.pathname} getPlants={this.getPlants} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} setUser={this.setUser} {...this.state} {...routerProps}/>}/>
    <Route exact path="/flowers" render={(routerProps)=> <PlantsContainer key={window.location.pathname} getPlants={this.getPlants} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} api={"flowers"} setUser={this.setUser} {...this.state} {...routerProps}/>}/>
    <Route exact path="/food" render={(routerProps)=> <PlantsContainer key={window.location.pathname} getPlants={this.getPlants} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} food_api={"https://theplantaeapi.herokuapp.com/api/v1/food"} setUser={this.setUser} {...this.state} {...routerProps}/>}/>
    <Route exact path={`/plants/page=${this.state.currentPage}`} render={(routerProps)=> <PlantsContainer setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} setUser={this.setUser} {...this.state} {...routerProps}/>}/>
    <Route exact path={`/plants/${this.state.currentPlant.id}`} render={(routerProps)=> <PlantShowPage   backToWol={this.backToWol} setUser={this.setUser} setCurrentPage={this.setCurrentPage} {...this.state} {...routerProps}/>}/>
    <Route exact path="/signup" render={(routerProps)=> <SignUp setUser={this.setUser} {...routerProps}/>}/>
    <Route exact path="/login" render={(routerProps)=> <LogIn setUser={this.setUser} {...routerProps}/>}/>
    <Route exact path="/log_out" render={(routerProps)=> <LogOut setUser={this.setUser} {...routerProps}/>}/>
    <Route exact path="/info" render={(routerProps)=> <Info {...routerProps}/>}/>
    <Route exact path="/identifier" render={(routerProps)=> <Identifier backToWol={this.backToWol} setUser={this.setUser} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} {...this.state} {...routerProps}/>}/>
    <Route exact path="/my_garden" render={(routerProps)=> <MyGarden getPlants={this.getPlants} setUser={this.setUser} setCurrentPage={this.setCurrentPage} setCurrentPlantId={this.setCurrentPlantId} {...this.state} {...routerProps}/>}/>
    </Switch>
    </div>
  );
 }
}

export default App;
