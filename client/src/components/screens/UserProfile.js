import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    //const [data, setData] = useState([]);
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result);
                //setData(result.posts);
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
                const newData = userProfile.posts.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return ({
                        ...prevState,
                        posts: [...newData]//overriding
                    });
                });
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
                const newData = userProfile.posts.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return ({
                        ...prevState,
                        posts: [...newData]//overriding
                    });
                });
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
                const newData = userProfile.posts.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return ({
                        ...prevState,
                        posts: [...newData]//overriding
                    });
                });
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
                const newData = userProfile.posts.filter(item => {
                    return item._id !== result._id;
                });
                setProfile((prevState) => {
                    return ({
                        ...prevState,
                        posts: [...newData]//overriding
                    });
                });
            }).catch(err => {
                console.log(err);
            })
    }

    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: 'UPDATE', payload: { followers: data.followers, following: data.following } });
                localStorage.setItem('user', JSON.stringify(data));
                setProfile((prevState) => {
                    return ({
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    });
                });
                setShowFollow(false);
            }).catch(err => {
                console.log(err);
            })
    }

    const unfollowUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: 'UPDATE', payload: { followers: data.followers, following: data.following } });
                localStorage.setItem('user', JSON.stringify(data));
                setProfile((prevState) => {
                    const newFollowers = prevState.user.followers.filter(item => item !== data._id);
                    return ({
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }
                    });
                });
                setShowFollow(true);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            {
                userProfile ?
                    <div className='flex-center flex-column'>
                        <div className="card minh-50vh h-400px card-custom w-50">
                            <div className="w-50 h-100p">
                                <div className="flex-center bg-gray w-100 h-60p">
                                    <img style={{ maxHeight: '200px', minWidth: '200px' }} className="border-radius-50p w-60 h-100p" src={userProfile.user.pic} alt="" />
                                </div>
                                <div className="w-100 h-40p">
                                    <h5 className='brand-logo ml-10 txt-align-left'> {userProfile.user.name} </h5>
                                    <p className="ls-2 txt-align-left ml-10">software developer</p>
                                    <div className="rating ml-10 txt-align-left">
                                        <i className="tiny material-icons">star_border</i>
                                        <i className="tiny material-icons">star</i>
                                        <i className="tiny material-icons">star_half</i>
                                        <i className="tiny material-icons">star_half</i>
                                        <i className="tiny material-icons">star_half</i>
                                        {showFollow ?
                                            <button style={{ display: "inline" }} onClick={() => followUser()} className="ml-10 btn-small waves-effect waves-light">follow</button> :
                                            <button style={{ display: "inline" }} onClick={() => unfollowUser()} className="ml-10 btn-small waves-effect waves-light">unfollow</button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="card-content w-50">
                                <h5 className="w-100 txt-align-left">intro</h5>
                                <p className="w-100 txt-align-left">hey there, this is a description</p>
                            </div>
                        </div>

                        <div className="flex-center bg-gray w-50" style={{ minWidth: '400px' }}>
                            <p className="posts">{userProfile.posts.length} posts</p>
                            <p className="followers">{userProfile.user.followers.length} followers</p>
                            <p className="following">{userProfile.user.following.length} following</p>
                        </div>

                        {
                            userProfile.posts.map((item) => {
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
                    : <h2>loading......</h2>
            }
        </>
    );
};

export default UserProfile;