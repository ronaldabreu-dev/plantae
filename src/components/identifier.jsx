import React from "react";
import Axios from 'axios';
import Camera from 'react-html5-camera-photo';
import CameraIos, { DEVICE, FACING_MODE, PLACEMENT } from 'react-camera-ios';
import {isMobile} from 'react-device-detect';
import 'react-html5-camera-photo/build/css/index.css';
import PlantsContainer from "./plants_container";
import TextLoop from "react-text-loop";
import Wol from "./Wol.gif";

class Identifier extends React.Component {
 state = {
   plants: [],
   indentifierResponse: [
     <span>Greetings {this.props.currentUser && this.props.currentUser.user.username}...</span>,
    <span>Welcome to Plantae!</span>,
    <span>My name is Wol</span>,
    <span>an old wise owl</span>,
    <span>need advice identifiying a plant?</span>,
    <span>show me an image of a plant or mushroom</span>,
    <span>and I will tell ya what I think!</span>,
    <span>...</span>
  ],
  queryImage: null,
  camera: "",
  wol: true
 }

 componentDidMount() {
   if (this.props.queryImage) {
      this.setState({ queryImage: this.props.queryImage },()=> this.postIdentification())
   }
 }

 takePhoto = (dataUri) => {
   this.setState({
     queryImage: dataUri,
   },()=> this.postIdentification())
 }

 openCamera = () => {
   console.log(isMobile)
  if (isMobile) {

   this.setState({
     camera: <div className="iosCamera">
    <CameraIos
      device={DEVICE.MOBILE}
      facingMode={FACING_MODE.ENVIRONMENT}
      placement={PLACEMENT.COVER}
      quality="1"
      onError={error => console.log(error)}
      onTakePhoto={dataUri => { this.takePhoto(dataUri) }}
    />
  </div>,
   wol: false
   })

  } else {
     this.setState({
     wol: false,
     camera:
     <Camera
     imageType = {"jpg"}
     onTakePhoto = {(dataUri) => { this.takePhoto(dataUri) }}
     />,
   })

  }
 }

 postIdentification = () => {
   this.setState({
    camera: "",
    wol: true
  })

     fetch("https://theplantaeapi.herokuapp.com/api/v1/identifier", {
       method: "POST",
       headers: {
      'Content-Type': 'application/json'
    },
       body: JSON.stringify(this.state.queryImage)
     })
     .then(res => res.json())
     .then(data => {
       console.log(data)
       if (data.error) {
         this.setState({
           indentifierResponse: ["input cant be blank.", "give me a link", "or local path", "and try again!"]
         })
      } else {
        console.log(data)
          this.setState({
            plants: data.suggestions,
            indentifierResponse: data.suggestions.map(plant => plant.plant_details.common_names)
          })
      }
    })
 }

 updateImagePath = e => {
  let reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])

  reader.onload = () => {
      this.setState({
        queryImage: reader.result
      },()=> this.postIdentification())
    }

 }

  render(){
    console.log(this.state)
    let queryImage = ""
    let plants = ""

    if (this.state.queryImage){
      let src = this.state.queryImage
      queryImage = <img
            src={src}
            alt={this.props.scientific_name}
            className="queryImage"
          />;
    }

    if (this.state.plants && this.state.plants.length > 0) {
      plants =
      <>
      <div className="idcards">
       <h1>Here are Wol's top picks form the Plantae Kingdom: </h1>
       </div>
       <div className="cards">
                <PlantsContainer
                {...this.props}
                identifier={true}
                plants={this.state.plants}/>
       </div>
       </>
  }

if (this.state.wol) {
    return(
      <>
      <div className="identifier-page">
      <div className="talk-bubble tri-right border round btm-left-in">
      <div className="talktext">
      <h2> <TextLoop children={this.state.indentifierResponse}interval={1000} springConfig={{ stiffness: 150 }}></TextLoop> </h2>
      </div>
      </div><br/>
      <div className="triangle">
      </div>
      <img
            src={Wol}
            alt={this.props.scientific_name}
            className="tenor"
          />
       <div className="identifier-form">
         <h1>Ask Wol</h1>
         {this.queryImage}
         <p>the plant identifiying owl</p>
              {queryImage}
         <h3>link to image</h3>
           <p>enter image url or choose a file</p>
           <input type="file" accept=".jpg" onChange={(e) => this.updateImagePath(e)} />
           <button onClick={this.openCamera}>Take Photo</button>
           <br/><br/>
       </div>
       </div>
       <div>
       {plants}
       </div>
       </>

    )
  } else  {
    return (
      this.state.camera
    )
    }
 }

}
export default Identifier;
