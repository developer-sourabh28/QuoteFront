import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AboutModel from './AboutModel';

const API_URL = 'https://quoteback-htn6.onrender.com/quote';

export default function QuoteModel({ quoteId, initialQuote, initialComments }) {
    const [quotes, setQuotes] = useState([]);
    const [newTheme, setNewTheme] = useState('');
    const [newQuote, setNewQuote] = useState('');
    const [newWriter, setNewWriter] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editTheme, setEditTheme] = useState('');
    const [editQuote, setEditQuote] = useState('');
    const [editWriter, setEditWriter] = useState('');

    const [commentText, setCommentText] = useState('');
    const [commentsVisible, setCommentsVisible] = useState({});
    const [comments, setComments] = useState({});

    const [theme, setTheme] = useState('white'); 
    const [isDropdownVisible, setDropdownVisible] = useState(false); 

    const [isOpen, setIsOpen] = useState(false);

    const [likes, setLikes] = useState([]);
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const [isComHovered, setIsComHovered] = useState(false);
    

    const togglePostForm = () => {
        setIsOpen((prev) => !prev);
    }

    const navigate = useNavigate();

    useEffect(() => {
        getQuotes();
        const savedTheme = localStorage.getItem('theme') || 'white';
        setTheme(savedTheme);
        document.body.style.backgroundColor = savedTheme;
    }, []);

    const getQuotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            setQuotes(response.data);
            response.data.forEach(quote => {
                fetchComments(quote._id);
            });
        } catch (error) {
            setError('Failed to load quotes');
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (color) => {
        setTheme(color);
        document.body.style.backgroundColor = color;
        localStorage.setItem('theme', color);
        setDropdownVisible(false);
    };

    const handleAboutClick = () => {
        setShowAboutModal(true);
    };

    const closeAboutModal = () => {
        setShowAboutModal(false);
    };

    const createQuote = async (imageUrl) => {
        try {
            const response = await axios.post(
                API_URL,
                { theme: newTheme, quote: newQuote, writer: newWriter, imageUrl },
                { withCredentials: true }
            );
            setQuotes([...quotes, response.data]);
            setNewTheme('');
            setNewQuote('');
            setNewWriter('');
        } catch (error) {
            setError('Failed to create quote');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('https://quoteback-htn6.onrender.com/api/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = response.data.url;
            await createQuote(imageUrl);
        } catch (error) {
            console.error('Error uploading file:', error.response?.data || error.message);
        }
    };

    const startEditing = (id, theme, quote, writer) => {
        setEditingId(id);
        setEditTheme(theme);
        setEditQuote(quote);
        setEditWriter(writer);
    };

    const updateQuote = async (id) => {
        try {
            const response = await axios.put(
                `${API_URL}/${id}`,
                { theme: editTheme, quote: editQuote, writer: editWriter },
                { withCredentials: true }
            );
            setQuotes(
                quotes.map((quote) => (quote._id === id ? response.data : quote))
            );
            setEditingId(null);
        } catch (error) {
            setError('Error editing quote');
        }
    };

    const deleteQuote = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
            setQuotes(quotes.filter((quote) => quote._id !== id));
        } catch (error) {
            setError('Error deleting quote');
        }
    };

    const handleLike = async (quoteId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found, please log in again');
                return;
            }

            const response = await axios.patch(
                `https://quoteback-htn6.onrender.com/api/${quoteId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const { likes, alreadyLiked } = response.data;
            setQuotes((prevQuotes) =>
                prevQuotes.map((quote) =>
                    quote._id === quoteId
                        ? { ...quote, likesCount: likes, userLiked: alreadyLiked }
                        : quote
                )
            );
        } catch (error) {
            console.error('Error handling like:', error.response?.data || error.message);
        }
    };

    const toggleComments = (quoteId) => {
        setCommentsVisible((prevState) => ({
            ...prevState,
            [quoteId]: !prevState[quoteId],
        }));

        if (!comments[quoteId]) {
            fetchComments(quoteId);
        }
    };

    const fetchComments = async (quoteId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `https://quoteback-htn6.onrender.com/api/${quoteId}/comments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments((prevComments) => ({
                ...prevComments,
                [quoteId]: response.data,
            }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmitComment = async (quoteId) => {
        if (!commentText.trim()) return;

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `https://quoteback-htn6.onrender.com/api/${quoteId}/comments`,
                { text: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments((prevComments) => ({
                ...prevComments,
                [quoteId]: [...(prevComments[quoteId] || []), response.data],
            }));
            setCommentText('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('https://quoteback-htn6.onrender.com/logout', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <div style={{
                backgroundColor:'#002D62', 
                marginTop:'1px', 
                borderRadius:'5px', 
                height:'60px', 
                }}>
            <div style={{ position: 'fixed', top: 10, left: 250 }}>
                <button
                    onClick={() => setDropdownVisible((prev) => !prev)}
                    style={{
                        padding: '10px',
                        backgroundColor: theme,
                        color: theme === 'black' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Theme
                </button>
                {isDropdownVisible && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '5px',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            // zIndex: 1000,
                        }}
                    >
                        
                        <div
                            onClick={() => handleThemeChange('grey')}
                            style={{
                                padding: '10px',
                                backgroundColor: 'grey',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Grey
                        </div> 
                        <div
                            onClick={() => handleThemeChange('white')}
                            style={{
                                padding: '10px',
                                backgroundColor: 'white',
                                color: 'black',
                                cursor: 'pointer',
                            }}
                        >
                            White
                        </div>
                    </div>
                )}
            </div>
              
            <button  
            style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: '#007BFF',
                position:'fixed',
                left:'130px',
                color: 'white',
                margin:"10px",
                border: 'none',
                borderRadius: '5px',
              }}
            onClick={handleAboutClick}>About</button>
            <button
            className='logoutBtn'
            style={{position: 'fixed', right: 20,}}
            onClick={handleLogout}>Logout</button>

                  <button
        onClick={togglePostForm}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
           position:'fixed',
           left:'20px',
          margin:'10px',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isOpen ? 'Close ❌' : 'Post 💌 '}
      </button>
      </div>
        
            {showAboutModal && <AboutModel onclose={closeAboutModal} />}
  <h1 className="introText">
  <span>"Share Moments, Inspire the World"</span><br/>
  "Welcome to GlobeGallery – Your Creative Space to Explore and Share!"
  </h1>

            {loading && <p>Loading...</p>}
            

<div style={{ textAlign: 'center', marginTop: '20px', marginLeft:'100px', }}>
      {/* Main Post Button */}

      {/* Hidden Form Section */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginBottom: '10px', display: 'block' }}
            />
          </div>
          <div>
            <input
              type="text"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              placeholder="Add Theme"
              style={{
                marginBottom: '10px',
                padding: '5px',
                width: '200px',
                display: 'block',
              }}
            />
            <input
              type="text"
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="Add Quote"
              style={{
                marginBottom: '10px',
                padding: '5px',
                width: '200px',
                display: 'block',
              }}
            />
            <input
              type="text"
              value={newWriter}
              onChange={(e) => setNewWriter(e.target.value)}
              placeholder="Add Writer name"
              style={{
                marginBottom: '10px auto',
                padding: '5px',
                width: '200px',
                display: 'block',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
                marginBottom: '10px',
                // padding: '5px',
                width: '100px',
                height:'35px',
                display: 'block',
                marginLeft:'45px',
                backgroundColor: '#28A745',
                border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding : "10px 20px",
              marginTop:'15px',
              }}
          >
            <span style={{fontSize:'15px'}}>Add 👍</span>
          </button>
        </form>
      )}
    </div>
    <hr/>
    <hr/>

            {quotes.map((quote) => (
                <div key={quote._id}>
                    <div style={{ display: 'flex', marginLeft: '30px', marginTop: '30px' }}>
  {quote.imageUrl && (
    <img
      src={quote.imageUrl}
      alt="Uploaded"
      style={{
        width: '250px',
        height: '180px',
        borderRadius: '10px',
        border: '10px solid black',
        marginRight: '20px',  // Adds space between the image and text
      }}
    />
  )}

  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
    <b>Theme: </b> {quote.theme} <br /><hr/>
    <b>Quote: </b> {quote.quote} <br /><hr/>
    <b>Writer: </b> {quote.writer} <br />
  </div>
</div>

<button
      style={{
        borderRadius: '5px',
        border: 'none',
        margin: '20px',
        fontWeight: 'bold',
        width: '80px',
        height: '25px',
        backgroundColor: 'black',
        color: isLikeHovered ? 'green' : 'white', // Change color on hover
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsLikeHovered(true)} // Trigger on hover
      onMouseLeave={() => setIsLikeHovered(false)} // Reset on mouse out
      onClick={() => handleLike(quote._id)}
    >
      {quote.userLiked ? 'Dislike 👎' : 'Like 👍'}
    </button>
                    <button 
                    style={{
                        borderRadius: '5px',
                        border: 'none',
                        margin: '20px',
                        fontWeight: 'bold',
                        width: '80px',
                        height: '25px',
                        backgroundColor: 'black',
                        color: isEditHovered ? 'orange' : 'white', // Change color on hover
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setIsEditHovered(true)} // Trigger on hover
                      onMouseLeave={() => setIsEditHovered(false)}
                    onClick={() => startEditing(quote._id, quote.theme, quote.quote, quote.writer)}>
                        Edit ✍️
                    </button>

                    <button 
                    style={{
                        borderRadius: '5px',
                        border: 'none',
                        margin: '20px',
                        fontWeight: 'bold',
                        width: '90px',
                        height: '25px',
                        backgroundColor: 'black',
                        color: isDeleteHovered ? 'red' : 'white', // Change color on hover
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setIsDeleteHovered(true)} // Trigger on hover
                      onMouseLeave={() => setIsDeleteHovered(false)}
                    onClick={() => deleteQuote(quote._id)}>
                        Delete 🗑️
                    </button>

                    <button 
                    style={{
                        borderRadius: '5px',
                        border: 'none',
                        margin: '20px',
                        fontWeight: 'bold',
                        width: '150px',
                        height: '25px',
                        backgroundColor: 'black',
                        color: isComHovered ? '#5F9EA0' : 'white', // Change color on hover
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setIsComHovered(true)} // Trigger on hover
                      onMouseLeave={() => setIsComHovered(false)}
                    onClick={() => toggleComments(quote._id)}>
                        {commentsVisible[quote._id] ? 'Hide Comments ❌' : 'Show Comments 💬'}
                    </button>
                    {commentsVisible[quote._id] && (
                        <div>
                            <ul>
                                {(comments[quote._id] || []).map((comment) => (
                                    <li key={comment._id}>{comment.text}</li>
                                ))}
                            </ul>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment"
                            />
                            <button onClick={() => handleSubmitComment(quote._id)}>
                                Post
                            </button>
                        </div>
                    )}
                    {editingId === quote._id && (
                        <div>
                            <input
                                type="text"
                                value={editTheme}
                                onChange={(e) => setEditTheme(e.target.value)}
                                placeholder="Edit Theme"
                            />
                            <input
                                type="text"
                                value={editQuote}
                                onChange={(e) => setEditQuote(e.target.value)}
                                placeholder="Edit Quote"
                            />
                            <input
                                type="text"
                                value={editWriter}
                                onChange={(e) => setEditWriter(e.target.value)}
                                placeholder="Edit Writer"
                            />
                            <button onClick={() => updateQuote(quote._id)}>Save</button>
                        </div>
                    )}
                    <hr style={{marginTop:'20px'}}></hr>
                </div>
            ))}
        </div>
        
    );
}

