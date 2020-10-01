import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../App';

const NavBar = () => {
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const searchModal = useRef(null);
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);
    const renderList = () => {
        if (state) {
            return (
                [<li key="1"><i data-target="modal1" className="tiny material-icons modal-trigger">search</i></li>,
                <li key="2"><Link to="/profile">profile</Link></li>,
                <li key="3"><Link to="/create">createPost</Link></li>,
                <li key="4"><Link to="/myfollowingpost">followings</Link></li>,
                <li key="5">
                    <button onClick={() => {
                        localStorage.clear();
                        dispatch({ type: 'CLEAR' });
                        history.push('/login');
                    }} className="btn-small waves-effect waves-light">logout</button>
                </li>]
            );
        } else {
            return (
                [<li key="6"><Link to="/login">login</Link></li>,
                <li key="7"><Link to="/signup">signup</Link></li>]
            );
        }
    }

    const fetchUsers = (query) => {
        setSearch(query);
        fetch('/search-users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user);
            }).catch(err => { console.log(err) })
    }

    return (
        <div className="navbar-fixed">
            <nav>
                <div className="nav-wrapper">
                    <Link to={state ? "/" : "/login"} className="brand-logo left">blogPic</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>
                <div style={{ color: "black" }} id="modal1" className="modal" ref={searchModal}>
                    <div className="modal-content">
                        <input placeholder="search users" value={search} onChange={e => fetchUsers(e.target.value)} type="text" />
                        <ul className="collection">
                            {
                                userDetails.map((item) => {
                                    return <Link onClick={() => { M.Modal.getInstance(searchModal.current).close(); setSearch(''); setUserDetails([]); }} to={item._id !== state._id ? '/profile/' + item._id : '/profile'}><li style={{ color: "black" }} className="collection-item">{item.email}</li></Link>
                                })
                            }
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => { setSearch(''); setUserDetails([]); }} className="modal-close waves-effect waves-green btn-flat">close</button>
                    </div>
                </div>
            </nav>
        </div >
    );
};

export default NavBar;