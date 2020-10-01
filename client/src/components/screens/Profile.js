import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { state, dispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [image, setImage] = useState('');
    //console.log(state);
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.mypost);
            }).catch(err => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        if (image) {
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
                    //localStorage.setItem('user', JSON.stringify({ ...state, pic: data.url }));
                    //dispatch({ type: 'UPDATEPIC', payload: data.url });
                    fetch('/updatepic', {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            //console.log(data.url);
                            localStorage.setItem('user', JSON.stringify({ ...state, pic: result.pic }));
                            dispatch({ type: 'UPDATEPIC', payload: {pic: result.pic }});
                            //console.log(result.pic);
                        }).catch(err => {
                            console.log(err);
                        })
                }).catch(err => { console.log(err) })
        }
    }, [image]);

    const updatePhoto = (file) => {
        setImage(file);
    };

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postId) => {
        fetch(`/delete/${postId}`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id;
                });
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className='flex-center flex-column'>
            <div className="card minh-50vh h-400px card-custom w-50">
                <div className="w-50 h-100p">
                    <label style={{ cursor: "pointer" }} htmlFor='pic-update' className="flex-center bg-gray w-100 h-60p">
                        <img style={{ maxHeight: '200px', minWidth: '200px' }} className="border-radius-50p w-60 h-100p" src={state && state.pic!==undefined ? state.pic : ''} alt="" />
                        <input id="pic-update" style={{ display: 'none' }} onChange={e => updatePhoto(e.target.files[0])} type="file" />
                    </label>
                    <div className="w-100 h-40p">
                        <h5 className='brand-logo ml-10 txt-align-left'> {state ? state.name : 'loading'} </h5>
                        <p className="ls-2 txt-align-left ml-10">software developer</p>
                        <div className="rating ml-10 txt-align-left">
                            <i className="tiny material-icons">star_border</i>
                            <i className="tiny material-icons">star</i>
                            <i className="tiny material-icons">star_half</i>
                            <i className="tiny material-icons">star_half</i>
                            <i className="tiny material-icons">star_half</i>
                            <button style={{ display: "inline" }} className="ml-10 btn-small waves-effect waves-light">follow</button>
                        </div>
                    </div>
                </div>
                <div className="card-content w-50">
                    <h5 className="w-100 txt-align-left">intro</h5>
                    <p className="w-100 txt-align-left">hey there, this is a description</p>
                </div>
            </div>

            <div className="flex-center bg-gray w-50" style={{ minWidth: '400px' }}>
                <p className="posts">{data.length} posts</p>
                <p className="followers">{state ? state.followers.length : ''} followers</p>
                <p className="following">{state ? state.following.length : ''} following</p>
            </div>

            {
                data.map((item) => {
                    return (
                        <div className="card card-custom w-45 flex-column" key={item._id}>
                            <h5 className='brand-logo w-100 ml-10 txt-align-left'> <Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : '/profile'} >{item.postedBy.name}</Link> {item.postedBy._id === state._id ? <i onClick={() => { deletePost(item._id) }} style={{ float: "right" }} className="material-icons mr-10">delete</i> : ''}</h5>
                            <img className="w-100" src={item.photo} alt="" />
                            <div className="card-content w-100">
                                <div className="rating w-100 txt-align-left">

                                    {item.likes.includes(state._id)
                                        ?
                                        <i onClick={() => { unlikePost(item._id) }} className="tiny material-icons">star</i>
                                        :
                                        <i onClick={() => { likePost(item._id) }} className="tiny material-icons">star_border</i>}

                                    {/*<i className="tiny material-icons">star_half</i>
                                    <i className="tiny material-icons">star_half</i>
                                    <i className="tiny material-icons">star_half</i>*/}
                                    <span>&nbsp;{item.likes.length} stars</span>
                                </div>
                                <h6 className="w-100 txt-align-left"> {item.title} </h6>
                                <p className="w-100 txt-align-left"> {item.body} </p>
                                {
                                    item.comments.map(record => {
                                        return (<div key={record._id} className="w-100 txt-align-left"><span style={{ fontWeight: '500' }}> {record.postedBy.name} </span> {record.text} </div>);
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                }} >
                                    <input placeholder="add your review" type="text" />
                                </form>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default Profile;