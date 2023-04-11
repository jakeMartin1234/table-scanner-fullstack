import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import App from './components/App';

const onSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    ReactDOM.render(<App credentials={credentialResponse} />, document.getElementById('root'));
};

const onError = () => {
    console.log('Login Failed');
};
ReactDOM.render(
    <div>
        <div>
            Table Scanner Login Page
        </div>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onError}
                cookiePolicy={'single_host_origin'}
            />
        </GoogleOAuthProvider>
    </div>,
    document.getElementById('root')
);