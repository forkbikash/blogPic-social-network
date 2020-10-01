import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const SubscribedUserPosts = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts);
            }).catch(err => {
                console.log(err);
            })
    }, []);

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
        <div className='home flex-center flex-column'>
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

export default SubscribedUserPosts;