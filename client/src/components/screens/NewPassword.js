import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const Login = () => {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const postData = () => {

        fetch('/new-password', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data);
                if (data.error) {
                    M.toast({ html: data.error });
                    //console.log(data);
                }
                else {
                    M.toast({ html: data.message });
                    //console.log(data);
                    history.push('/login');
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
                        <input placeholder="enter new password" id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                    </div>

                    <button onClick={() => postData()} className="btn-small waves-effect waves-light">update password</button>

                </div>
            </div>
        </div>
    );
};

export default Login;