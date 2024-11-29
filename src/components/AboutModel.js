import React from 'react'

export default function AboutModel({onclose}) {
  return (
    <div style={modalStyle}>
    <h2>🌍 About GlobeGallery 🌟</h2>
    <p>GlobeGallery is a vibrant platform for travelers and adventurers to share their journeys with the world! 🗺️✨ Users can sign up, log in, and post captivating images 📸 of the places they've visited. Along with each image, they can share the name of the location 📍, personal memories, and unforgettable stories of their adventures.
  <br/>
<p style={{marginBottom:'5px'}}>🌟 Connect & Engage</p>
GlobeGallery fosters a sense of community by allowing users to like ❤️ and comment 💬 on posts, creating a space for interaction and inspiration. Users also have the freedom to edit ✏️ or delete 🗑️ their posts, ensuring their travel stories stay authentic and true to their vision.

Whether you're an avid traveler 🌎 or someone who loves discovering new places 🏞️ through others’ eyes, GlobeGallery is your window to the world 🌟, one memory at a time.</p>
    <button style={{background:'none', marginTop:'10px', fontSize:'15px',borderRadius:'10px', color:'red'}} onClick={onclose}>Close <b style={{fontSize:'20px'}}>X</b></button>
    </div>
  )
}

const modalStyle = {
    position: 'fixed',
    width : "70%",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#bbe4e9',
    padding: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,   
};
