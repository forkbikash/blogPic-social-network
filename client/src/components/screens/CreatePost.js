import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [descrip, setDescrip] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (url) {
            fetch('/createpost', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    title,
                    body: descrip,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error });
                        //console.log(data);
                    }
                    else {
                        //M.toast({ html: JSON.stringify(data.post) });
                        M.toast({ html: 'post created successfully' });
                        //console.log(data);
                        history.push('/');
                    }

                }).catch(err => { console.log(err) })
        }
    }, [url])

    const postDetails = () => {
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

    return (
        <div className='card-container flex-center'>
            <div className="card card-custom w-45 pb-5">
                <div style={{
                    width: '90%'
                }} >
                    <h4 className='brand-logo'>blogPic</h4>

                    <div className="input-field">
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="title" type="text" />
                    </div>

                    <div className="input-field">
                        <input value={descrip} onChange={e => setDescrip(e.target.value)} placeholder="descrip" type="text" />
                    </div>
                    <div className="file-field input-field">
                        <div className="btn-small">
                            <span>upload image</span>
                            <input onChange={e => setImage(e.target.files[0])} type="file" />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path" type="text" />
                        </div>
                    </div>

                    <button onClick={() => postDetails()} className="btn-small waves-effect waves-light">Post</button>

                </div>
            </div>
        </div>
    );
};

export default CreatePost;