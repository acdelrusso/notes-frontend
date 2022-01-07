import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import NoteForm from './components/NoteForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
      event.preventDefault()
      
      try {
          const user = await loginService.login({
              username, password
          })
          window.localStorage.setItem(
              "loggedNoteappUser", JSON.stringify(user)
          )
          noteService.setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
      } catch(exception){
          setErrorMessage('Wrong credentials')
          setTimeout(() => {
              setErrorMessage(null)
          }, 5000)
      }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setErrorMessage(`User ${user.name} logged out`)
    setUser(null)
    setTimeout(() => {
        setErrorMessage(null)
    }, 5000)
    
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
        .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
    .update(id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })    
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)



  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? 
      <LoginForm {...{setUsername, handleLogin, setPassword, username, password}} /> :
      <div>
      <p>{user.name} logged-in</p>
      <NoteForm {...{handleNoteChange, newNote, addNote, handleLogout}}/>
      </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      <ul>
        {notesToShow.map(note => 
            <Note
              key={note.id}
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App