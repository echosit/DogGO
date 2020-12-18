import React from 'react';
import { Link } from 'react-router-dom';

export default function GreetingScreen() {

    return (
        <div className="top cover row">
            <div className="col-2 coverText">
                <div> 
                <div className="greeting">Bring Your Furry Friend Home</div>
                <Link className="nospace" to="/products">
                    <button className="big">MEET DOGS</button>
                </Link>
                </div>
            </div> 
            <div className="col-2 center">
                <img className="coverImg" src="images/girlanddog.png" alt="girl embracing doggo"></img>
            </div>
        </div>
    ); 
} 