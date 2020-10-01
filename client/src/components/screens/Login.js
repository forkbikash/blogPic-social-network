import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const Login = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const postData = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'invalid email' });
            return;
        }

        fetch('/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data);
                if (data.error) {
                    M.toast({ html: data.error });
                    //console.log(data);
                }
                else {
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    dispatch({ type: 'USER', payload: data.user });
                    M.toast({ html: 'signed in successfully' });
                    //console.log(data);
                    history.push('/');
                }

            }).catch(err => { console.log(err) })
    };

    return (
        <div className='card-container flex-center'>
            <div className="card card-custom w-45 pb-5">
                <div style={{
                    width: '90%'
                }} >
                    <h4 className='brand-logo'>blogPic</h4>
                    <div className="input-field">
                        <input placeholder="email" id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                    </div>
                    <div className="input-field">
                        <input placeholder="password" id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                    </div>

                    <button onClick={() => postData()} className="btn-small waves-effect waves-light">login</button>

                   <h6>
                       <Link to="/reset">forgot password?</Link>
                   </h6>

                </div>
            </div>
        </div>
    );
};

export default Login;