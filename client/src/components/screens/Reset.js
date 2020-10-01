import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');

    const postData = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'invalid email' });
            return;
        }

        fetch('/reset-password', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
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
                        <input placeholder="email" id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                    </div>
                    <button onClick={() => postData()} className="btn-small waves-effect waves-light">reset password</button>

                </div>
            </div>
        </div>
    );
};

export default Reset;