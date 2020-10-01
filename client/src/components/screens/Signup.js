import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {

    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'blogPic');
        data.append('cloud_name', 'cloudbikash');

        fetch('https://api.cloudinary.com/v1_1/cloudbikash/image/upload', {
            method: 'post',
            /*headers: {
                'Content-Type': 'application/json'
            },*/
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url);
            }).catch(err => { console.log(err) })

    };

    const uploadFields = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'invalid email' });
            return;
        }

        fetch('/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
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
    }

    const postData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }
    };

    return (
        <div className='card-container flex-center'>
            <div className="card card-custom w-45 pb-5">
                <div style={{
                    width: '90%'
                }} >
                    <h4 className='brand-logo'>blogPic</h4>
                    <div className="input-field">
                        <input placeholder="name" id="name" value={name} onChange={e => setName(e.target.value)} type="text" />
                    </div>

                    <div className="input-field">
                        <input placeholder="email" id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                    </div>

                    <div className="input-field">
                        <input placeholder="password" id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                    </div>

                    <div className="file-field input-field">
                        <div className="btn-small">
                            <span>upload pic</span>
                            <input onChange={e => setImage(e.target.files[0])} type="file" />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path" type="text" />
                        </div>
                    </div>

                    <button onClick={() => postData()} className="btn-small waves-effect waves-light">signup</button>

                </div>
            </div>
        </div>
    );
};

export default Signup;